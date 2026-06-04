import { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Trash2,
  Bot,
  User,
  ChevronDown,
  History,
} from 'lucide-react';
import { useChat } from '../context/ChatContext';
import type { ApiData } from '../types';
import { formatTime } from '../utils/helpers';

interface ChatPanelProps {
  section: string;
  currentData: ApiData;
}

export default function ChatPanel({ section, currentData }: ChatPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { messages, sendMessage, clearMessages, isLoading, currentStreamingContent } = useChat(section);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, currentStreamingContent, isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const content = input.trim();
    setInput('');
    await sendMessage(content, currentData);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const hasMessages = messages.length > 0;

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
          isOpen
            ? 'bg-red-500 hover:bg-red-600 text-white rotate-90'
            : 'bg-ink hover:bg-ink/90 text-white hover:-translate-y-1'
        }`}
        title={isOpen ? '关闭对话' : 'AI学习助手'}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

      {/* Chat Panel */}
      <div
        className={`fixed right-0 top-0 h-full bg-white shadow-2xl z-30 transition-transform duration-300 ease-in-out flex flex-col
          w-full sm:w-[400px] md:w-[420px] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-ink text-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber flex items-center justify-center">
              <Bot size={18} className="text-ink" />
            </div>
            <div>
              <h3 className="font-medium text-sm">AI学习助手</h3>
              <p className="text-xs text-white/60">
                {isLoading ? '思考中...' : '基于当前内容答疑'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className={`p-2 rounded-lg transition-colors ${showHistory ? 'bg-white/20' : 'hover:bg-white/10'}`}
              title="历史记录"
            >
              <History size={16} />
            </button>
            <button
              onClick={() => clearMessages()}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              title="清空对话"
            >
              <Trash2 size={16} />
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* History View */}
        {showHistory ? (
          <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
            <button
              onClick={() => setShowHistory(false)}
              className="flex items-center gap-1 text-sm text-muted hover:text-ink mb-4 transition-colors"
            >
              <ChevronDown size={16} className="rotate-90" />
              返回对话
            </button>
            {messages.length === 0 ? (
              <div className="text-center text-muted py-12">
                <History size={32} className="mx-auto mb-2 opacity-40" />
                <p>暂无对话历史</p>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className="p-3 rounded-lg bg-ivory border border-gray-100 cursor-pointer hover:border-amber transition-colors"
                    onClick={() => setShowHistory(false)}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        msg.role === 'user' ? 'bg-ink/10 text-ink' : 'bg-amber/20 text-amber-700'
                      }`}>
                        {msg.role === 'user' ? '我' : 'AI'}
                      </span>
                      <span className="text-xs text-muted">{formatTime(msg.timestamp)}</span>
                    </div>
                    <p className="text-sm text-charcoal line-clamp-2">{msg.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
              {!hasMessages && !isLoading && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-amber/20 flex items-center justify-center mx-auto mb-4">
                    <Bot size={28} className="text-amber" />
                  </div>
                  <h4 className="text-lg font-medium text-ink mb-2 font-serif">AI学习助手</h4>
                  <p className="text-sm text-muted max-w-xs mx-auto">
                    我可以基于当前页面的学习内容为你答疑解惑，深入讲解知识点。
                  </p>
                  <div className="mt-6 space-y-2">
                    <p className="text-xs text-muted">你可以尝试问：</p>
                    <button
                      onClick={() => sendMessage('详细讲解一下这个内容', currentData)}
                      className="block w-full text-left px-4 py-2 text-sm bg-ivory rounded-lg hover:bg-amber/10 hover:text-ink transition-colors text-muted"
                    >
                      详细讲解一下这个内容
                    </button>
                    <button
                      onClick={() => sendMessage('有什么相关的拓展知识？', currentData)}
                      className="block w-full text-left px-4 py-2 text-sm bg-ivory rounded-lg hover:bg-amber/10 hover:text-ink transition-colors text-muted"
                    >
                      有什么相关的拓展知识？
                    </button>
                  </div>
                </div>
              )}

              {messages.map((msg, index) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 animate-fade-in-up ${
                    msg.role === 'user' ? 'flex-row-reverse' : ''
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.role === 'user' ? 'bg-ink text-white' : 'bg-amber text-ink'
                  }`}>
                    {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                  </div>
                  <div className={`max-w-[80%] ${
                    msg.role === 'user' ? 'text-right' : ''
                  }`}>
                    <div className={`inline-block px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-ink text-white rounded-br-md'
                        : 'bg-ivory text-charcoal rounded-bl-md border border-gray-100'
                    }`}>
                      {msg.content}
                    </div>
                    <div className="text-xs text-muted mt-1 px-1">
                      {formatTime(msg.timestamp)}
                    </div>
                  </div>
                </div>
              ))}

              {/* Streaming Content */}
              {isLoading && currentStreamingContent && (
                <div className="flex gap-3 animate-fade-in-up">
                  <div className="w-8 h-8 rounded-full bg-amber text-ink flex items-center justify-center flex-shrink-0">
                    <Bot size={14} />
                  </div>
                  <div className="max-w-[80%]">
                    <div className="inline-block px-4 py-2.5 rounded-2xl rounded-bl-md bg-ivory text-charcoal border border-gray-100 text-sm leading-relaxed typing-cursor">
                      {currentStreamingContent}
                    </div>
                  </div>
                </div>
              )}

              {/* Loading Indicator */}
              {isLoading && !currentStreamingContent && (
                <div className="flex gap-3 animate-fade-in-up">
                  <div className="w-8 h-8 rounded-full bg-amber text-ink flex items-center justify-center flex-shrink-0">
                    <Bot size={14} />
                  </div>
                  <div className="bg-ivory rounded-2xl rounded-bl-md px-4 py-3 border border-gray-100">
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-amber animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 rounded-full bg-amber animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 rounded-full bg-amber animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-100 bg-white">
              <div className="flex items-center gap-2 bg-ivory rounded-xl px-4 py-2 border border-gray-100 focus-within:border-amber focus-within:ring-2 focus-within:ring-amber/20 transition-all">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="输入问题，AI为你解答..."
                  className="flex-1 bg-transparent outline-none text-sm text-charcoal placeholder:text-muted"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className={`p-2 rounded-lg transition-all ${
                    input.trim() && !isLoading
                      ? 'bg-ink text-white hover:bg-ink/90'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Send size={16} />
                </button>
              </div>
              <p className="text-xs text-center text-muted mt-2">
                AI回答基于当前页面内容，由 DeepSeek 提供支持
              </p>
            </div>
          </>
        )}
      </div>
    </>
  );
}
