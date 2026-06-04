import React, { useCallback, useRef } from 'react';
import type { ChatMessage, ChatHistory, ApiData, StreamingState } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { generateId, getSystemPrompt } from '../utils/helpers';
import { ChatContext } from './chatContext';

const STORAGE_KEY = 'clearlearn_chat_history_v2';

const DEFAULT_STREAMING_STATE: StreamingState = {
  content: '',
  isLoading: false,
  error: null,
  abortController: null,
};

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [chatHistory, setChatHistory] = useLocalStorage<ChatHistory>(STORAGE_KEY, {});
  const streamingStatesRef = useRef<Record<string, StreamingState>>({});
  const listenersRef = useRef<Set<() => void>>(new Set());

  const notifyListeners = useCallback(() => {
    listenersRef.current.forEach((listener) => listener());
  }, []);

  const getSectionState = useCallback((section: string): StreamingState => {
    return streamingStatesRef.current[section] || DEFAULT_STREAMING_STATE;
  }, []);

  const subscribe = useCallback((callback: () => void) => {
    listenersRef.current.add(callback);
    return () => {
      listenersRef.current.delete(callback);
    };
  }, []);

  const setSectionState = useCallback(
    (section: string, updates: Partial<StreamingState>) => {
      const prevSection = streamingStatesRef.current[section] || DEFAULT_STREAMING_STATE;
      streamingStatesRef.current = {
        ...streamingStatesRef.current,
        [section]: { ...prevSection, ...updates },
      };
      notifyListeners();
    },
    [notifyListeners]
  );

  const addMessage = useCallback(
    (section: string, message: ChatMessage) => {
      setChatHistory((prev) => ({
        ...prev,
        [section]: [...(prev[section] || []), message],
      }));
    },
    [setChatHistory]
  );

  const sendMessage = useCallback(
    async (content: string, section: string, currentData: ApiData) => {
      const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
      if (!apiKey || apiKey === 'sk-your-api-key-here') {
        const errorMsg: ChatMessage = {
          id: generateId(),
          role: 'assistant',
          content: '未配置DeepSeek API密钥。请在项目根目录的 .env 文件中设置 VITE_DEEPSEEK_API_KEY。',
          timestamp: Date.now(),
          section,
          status: 'error',
          errorMessage: 'API密钥未配置',
        };
        addMessage(section, errorMsg);
        return;
      }

      // Cancel any ongoing request for this section
      const existingState = streamingStatesRef.current[section];
      if (existingState?.abortController) {
        existingState.abortController.abort();
      }

      const abortController = new AbortController();

      const userMsg: ChatMessage = {
        id: generateId(),
        role: 'user',
        content,
        timestamp: Date.now(),
        section,
        status: 'sent',
      };
      addMessage(section, userMsg);

      setSectionState(section, {
        isLoading: true,
        content: '',
        error: null,
        abortController,
      });

      try {
        const sectionMessages = chatHistory[section] || [];
        const systemPrompt = getSystemPrompt(section, currentData);

        const messages = [
          { role: 'system' as const, content: systemPrompt },
          ...sectionMessages.slice(-10).map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
          { role: 'user' as const, content },
        ];

        const apiUrl =
          import.meta.env.VITE_DEEPSEEK_API_URL || 'https://api.deepseek.com/chat/completions';
        const model = import.meta.env.VITE_DEEPSEEK_MODEL || 'deepseek-chat';

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model,
            messages,
            stream: true,
          }),
          signal: abortController.signal,
        });

        if (!response.ok) {
          let errorMessage = `请求失败: ${response.status}`;
          try {
            const errorData = await response.json();
            errorMessage = errorData.error?.message || errorMessage;
          } catch {
            // ignore parse error
          }
          throw new Error(errorMessage);
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let fullContent = '';
        let buffer = '';

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              const trimmedLine = line.trim();
              if (!trimmedLine.startsWith('data: ')) continue;

              const data = trimmedLine.slice(6);
              if (data === '[DONE]') continue;

              try {
                const parsed = JSON.parse(data);
                const delta = parsed.choices?.[0]?.delta;
                if (delta?.content) {
                  fullContent += delta.content;
                  setSectionState(section, { content: fullContent });
                } else if (delta?.reasoning_content) {
                  fullContent += delta.reasoning_content;
                  setSectionState(section, { content: fullContent });
                }
              } catch {
                // ignore parse error for malformed lines
              }
            }
          }

          // Process remaining buffer
          if (buffer.trim().startsWith('data: ')) {
            const data = buffer.trim().slice(6);
            if (data !== '[DONE]') {
              try {
                const parsed = JSON.parse(data);
                const delta = parsed.choices?.[0]?.delta;
                if (delta?.content) {
                  fullContent += delta.content;
                  setSectionState(section, { content: fullContent });
                } else if (delta?.reasoning_content) {
                  fullContent += delta.reasoning_content;
                  setSectionState(section, { content: fullContent });
                }
              } catch {
                // ignore parse error
              }
            }
          }
        }

        const assistantMsg: ChatMessage = {
          id: generateId(),
          role: 'assistant',
          content: fullContent,
          timestamp: Date.now(),
          section,
          status: 'sent',
        };
        addMessage(section, assistantMsg);
        setSectionState(section, {
          content: '',
          isLoading: false,
          error: null,
          abortController: null,
        });
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          setSectionState(section, {
            isLoading: false,
            error: null,
            abortController: null,
          });
          return;
        }

        const errorContent =
          err instanceof Error ? err.message : '请求失败，请检查API密钥和网络连接';
        const errorMsg: ChatMessage = {
          id: generateId(),
          role: 'assistant',
          content: `抱歉，发生了错误：${errorContent}`,
          timestamp: Date.now(),
          section,
          status: 'error',
          errorMessage: errorContent,
        };
        addMessage(section, errorMsg);
        setSectionState(section, {
          isLoading: false,
          error: errorContent,
          abortController: null,
        });
      }
    },
    [addMessage, chatHistory, setSectionState]
  );

  const clearMessages = useCallback(
    (section: string) => {
      const state = streamingStatesRef.current[section];
      if (state?.abortController) {
        state.abortController.abort();
      }
      setChatHistory((prev) => ({
        ...prev,
        [section]: [],
      }));
      setSectionState(section, DEFAULT_STREAMING_STATE);
    },
    [setChatHistory, setSectionState]
  );

  const cancelGeneration = useCallback(
    (section: string) => {
      const state = streamingStatesRef.current[section];
      if (state?.abortController) {
        state.abortController.abort();
      }
      setSectionState(section, {
        isLoading: false,
        content: '',
        error: null,
        abortController: null,
      });
    },
    [setSectionState]
  );

  return (
    <ChatContext.Provider
      value={{
        chatHistory,
        sendMessage,
        clearMessages,
        cancelGeneration,
        getSectionState,
        subscribe,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}
