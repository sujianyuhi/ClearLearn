import React, { createContext, useContext, useCallback, useState } from 'react';
import type { ChatMessage, ChatHistory, ApiData } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { generateId, getSystemPrompt } from '../utils/helpers';

interface ChatContextType {
  messages: ChatMessage[];
  sendMessage: (content: string, section: string, currentData: ApiData) => Promise<void>;
  clearMessages: (section: string) => void;
  isLoading: boolean;
  currentStreamingContent: string;
}

const ChatContext = createContext<ChatContextType | null>(null);

const STORAGE_KEY = 'clearlearn_chat_history';

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [chatHistory, setChatHistory] = useLocalStorage<ChatHistory>(STORAGE_KEY, {});
  const [isLoading, setIsLoading] = useState(false);
  const [currentStreamingContent, setCurrentStreamingContent] = useState('');

  const getSectionMessages = useCallback((section: string): ChatMessage[] => {
    return chatHistory[section] || [];
  }, [chatHistory]);

  const addMessage = useCallback((section: string, message: ChatMessage) => {
    setChatHistory(prev => ({
      ...prev,
      [section]: [...(prev[section] || []), message],
    }));
  }, [setChatHistory]);

  const sendMessage = useCallback(async (content: string, section: string, currentData: ApiData) => {
    const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
    if (!apiKey || apiKey === 'sk-your-api-key-here') {
      const errorMsg: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: '未配置DeepSeek API密钥。请在项目根目录的 .env 文件中设置 VITE_DEEPSEEK_API_KEY。',
        timestamp: Date.now(),
        section,
      };
      addMessage(section, errorMsg);
      return;
    }

    const userMsg: ChatMessage = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: Date.now(),
      section,
    };
    addMessage(section, userMsg);

    setIsLoading(true);
    setCurrentStreamingContent('');

    try {
      const sectionMessages = getSectionMessages(section);
      const systemPrompt = getSystemPrompt(section, currentData);

      const messages = [
        { role: 'system' as const, content: systemPrompt },
        ...sectionMessages.slice(-10).map(msg => ({
          role: msg.role,
          content: msg.content,
        })),
        { role: 'user' as const, content },
      ];

      const apiUrl = import.meta.env.VITE_DEEPSEEK_API_URL || 'https://api.deepseek.com/chat/completions';
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
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `请求失败: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') continue;

              try {
                const parsed = JSON.parse(data);
                const delta = parsed.choices?.[0]?.delta?.content;
                if (delta) {
                  fullContent += delta;
                  setCurrentStreamingContent(fullContent);
                }
              } catch {
                // ignore parse error
              }
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
      };
      addMessage(section, assistantMsg);
      setCurrentStreamingContent('');
    } catch (err) {
      const errorContent = err instanceof Error ? err.message : '请求失败，请检查API密钥和网络连接';
      const errorMsg: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: `抱歉，发生了错误：${errorContent}`,
        timestamp: Date.now(),
        section,
      };
      addMessage(section, errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [addMessage, getSectionMessages]);

  const clearMessages = useCallback((section: string) => {
    setChatHistory(prev => ({
      ...prev,
      [section]: [],
    }));
  }, [setChatHistory]);

  return (
    <ChatContext.Provider value={{
      messages: [],
      sendMessage,
      clearMessages,
      isLoading,
      currentStreamingContent,
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat(section: string) {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within ChatProvider');
  }

  const [chatHistory] = useLocalStorage<ChatHistory>(STORAGE_KEY, {});
  const sectionMessages = chatHistory[section] || [];

  return {
    messages: sectionMessages,
    sendMessage: (content: string, currentData: ApiData) => context.sendMessage(content, section, currentData),
    clearMessages: () => context.clearMessages(section),
    isLoading: context.isLoading,
    currentStreamingContent: context.currentStreamingContent,
  };
}
