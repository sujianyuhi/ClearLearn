import { useState, useRef, useEffect, useCallback } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Trash2,
  Bot,
  User,
  ChevronDown,
  History,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Square,
  Compass,
} from 'lucide-react';
import { useChat } from '../hooks/useChat';
import type { ApiData, ChatMessage } from '../types';
import { formatTime, formatFullDate, getQuickQuestions, copyToClipboard } from '../utils/helpers';
import { renderMarkdownToJSX } from './MarkdownRenderer';

interface ChatPanelProps {
  section: string;
  currentData: ApiData;
}

export default function ChatPanel({ section, currentData }: ChatPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, clearMessages, cancelGeneration, isLoading, currentStreamingContent, error } =
    useChat(section);

  // Smooth scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current && containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, currentStreamingContent, isOpen]);

  // Auto-focus input
  useEffect(() => {
    if (isOpen && inputRef.current && !showHistory) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, showHistory]);

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 140)}px`;
    }
  }, [input]);

  // Close panel when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (window.innerWidth >= 640) return;
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // ESC to close panel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || isLoading) return;
    const content = input.trim();
    setInput('');
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }
    await sendMessage(content, currentData);
  }, [input, isLoading, sendMessage, currentData]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const handleCopy = useCallback(async (content: string, id: string) => {
    await copyToClipboard(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  const handleRetry = useCallback(
    async (msg: ChatMessage) => {
      const msgIndex = messages.findIndex((m) => m.id === msg.id);
      if (msgIndex > 0) {
        const userMsg = messages[msgIndex - 1];
        if (userMsg.role === 'user') {
          await sendMessage(userMsg.content, currentData);
        }
      }
    },
    [messages, sendMessage, currentData]
  );

  const hasMessages = messages.length > 0;
  const quickQuestions = getQuickQuestions(section, currentData).slice(0, 4);
  const unreadCount = hasMessages ? messages.filter((m) => m.role === 'assistant').length : 0;

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-40 flex items-center justify-center transition-all duration-500 ease-out-soft hover:scale-110 active:scale-95 ${
          isOpen
            ? 'w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-charcoal to-ink text-amber shadow-2xl shadow-charcoal/40'
            : 'w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-ink via-ink-light to-ink-deep text-white shadow-2xl shadow-ink/40 ring-1 ring-white/10'
        } rounded-full group`}
        title={isOpen ? '关闭对话' : 'AI学习助手'}
      >
        {/* Glow ring behind button */}
        {!isOpen && (
          <div className="absolute inset-0 rounded-full bg-amber/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-125" />
        )}
        {isOpen ? (
          <X size={22} strokeWidth={2.5} />
        ) : (
          <div className="relative">
            <MessageSquare size={24} strokeWidth={2} />
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-gradient-to-br from-amber to-amber-deep text-ink text-[10px] font-bold rounded-full flex items-center justify-center shadow-md ring-2 ring-white animate-breathe" style={{ animationDuration: '2s' }}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </div>
        )}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-ink/20 backdrop-blur-[3px] z-20 sm:hidden animate-fade-in"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Chat Panel */}
      <div
        ref={panelRef}
        className={`fixed right-0 top-0 h-full bg-white z-30 transition-transform duration-500 ease-out-soft flex flex-col w-full sm:w-[420px] md:w-[460px] rounded-l-3xl sm:rounded-l-3xl shadow-[0_0_80px_-15px_rgba(30,58,95,0.25)] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        {/* Header */}
        <div className="relative flex items-center justify-between px-5 py-4 rounded-tl-3xl bg-gradient-to-br from-ink via-ink-light to-ink-deep text-white shrink-0 overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-amber/8 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4 animate-breathe" style={{ animationDuration: '8s' }} />
          <div className="absolute bottom-0 left-1/3 w-24 h-24 bg-teal/8 rounded-full blur-2xl translate-y-1/2 animate-breathe" style={{ animationDuration: '6s', animationDelay: '2s' }} />
          {/* Top gradient accent line */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber/30 to-transparent" />

          <div className="relative flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-amber to-amber-deep flex items-center justify-center shadow-lg shadow-amber/30">
              <Sparkles size={18} className="text-ink" strokeWidth={2.5} />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-ink-light animate-pulse-soft" />
            </div>
            <div className="leading-tight">
              <h3 className="font-semibold text-[15px] tracking-wide">AI 学习助手</h3>
              <p className="text-[11px] text-white/55 mt-0.5 flex items-center gap-1.5">
                {isLoading ? (
                  <>
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber opacity-75" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber" />
                    </span>
                    正在思考中...
                  </>
                ) : (
                  <>
                    <Compass size={10} className="text-amber/70" />
                    基于当前内容答疑
                  </>
                )}
              </p>
            </div>
          </div>
          <div className="relative flex items-center gap-1">
            <HeaderButton
              active={showHistory}
              onClick={() => setShowHistory(!showHistory)}
              title="历史记录"
              icon={<History size={15} />}
            />
            <HeaderButton onClick={() => clearMessages()} title="清空对话" icon={<Trash2 size={15} />} />
            <HeaderButton onClick={() => setIsOpen(false)} title="关闭" icon={<X size={15} />} />
          </div>
        </div>

        {/* Content Area */}
        {showHistory ? (
          <HistoryView
            messages={messages}
            onClose={() => setShowHistory(false)}
            onSelectMessage={() => setShowHistory(false)}
          />
        ) : (
          <>
            {/* Messages */}
            <div
              ref={containerRef}
              className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin scroll-smooth bg-gradient-to-b from-ivory/30 to-transparent"
            >
              {!hasMessages && !isLoading && (
                <WelcomeView
                  section={section}
                  quickQuestions={quickQuestions}
                  onSend={sendMessage}
                  currentData={currentData}
                />
              )}

              {messages.map((msg, index) => (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  index={index}
                  copiedId={copiedId}
                  onCopy={handleCopy}
                  onRetry={handleRetry}
                />
              ))}

              {/* Streaming Content */}
              {isLoading && currentStreamingContent && (
                <div className="flex gap-2.5 animate-fade-in-up">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber to-amber-deep text-ink flex items-center justify-center flex-shrink-0 shadow-md shadow-amber/25 animate-float">
                    <Bot size={15} strokeWidth={2.5} />
                  </div>
                  <div className="max-w-[80%]">
                    <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-white text-charcoal border border-amber/15 shadow-sm">
                      <div className="text-sm leading-relaxed markdown-content">
                        {renderMarkdownToJSX(currentStreamingContent)}
                      </div>
                      <div className="typing-cursor mt-1" />
                    </div>
                  </div>
                </div>
              )}

              {/* Loading Indicator */}
              {isLoading && !currentStreamingContent && (
                <div className="flex gap-2.5 animate-fade-in-up">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber to-amber-deep text-ink flex items-center justify-center flex-shrink-0 shadow-md shadow-amber/25 animate-float">
                    <Bot size={15} strokeWidth={2.5} />
                  </div>
                  <div className="bg-white rounded-2xl rounded-tl-sm px-5 py-4 border border-amber/15 shadow-sm">
                    <div className="flex gap-1.5 items-center">
                      <div className="w-2 h-2 rounded-full bg-amber animate-bounce-mild" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 rounded-full bg-amber animate-bounce-mild" style={{ animationDelay: '120ms' }} />
                      <div className="w-2 h-2 rounded-full bg-amber animate-bounce-mild" style={{ animationDelay: '240ms' }} />
                      <span className="text-xs text-muted ml-2 font-medium">AI 正在思考...</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && !isLoading && (
                <div className="flex gap-2.5 animate-fade-in-up">
                  <div className="w-9 h-9 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <X size={15} strokeWidth={2.5} />
                  </div>
                  <div className="max-w-[80%]">
                    <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-rose-50/80 text-rose-700 border border-rose-100 text-sm shadow-sm">
                      {error}
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-amber/10 bg-white/95 backdrop-blur-md shrink-0 relative">
              {/* Top gradient accent */}
              <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-amber/20 to-transparent" />
              <div className="flex items-end gap-2 bg-ivory rounded-2xl px-4 py-2.5 border border-amber/15 focus-within:border-amber/50 focus-within:ring-2 focus-within:ring-amber/20 focus-within:bg-white focus-within:shadow-lg focus-within:shadow-amber/5 transition-all duration-400 shadow-sm">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="输入问题，AI 为你解答..."
                  rows={1}
                  className="flex-1 bg-transparent outline-none text-sm text-charcoal placeholder:text-muted/60 resize-none max-h-[140px] py-1.5 leading-relaxed"
                  disabled={isLoading}
                />
                {isLoading ? (
                  <button
                    onClick={() => cancelGeneration()}
                    className="p-2.5 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-100 hover:text-rose-600 transition-all duration-200 mb-0.5 active:scale-90 shadow-sm"
                    title="停止生成"
                  >
                    <Square size={14} fill="currentColor" />
                  </button>
                ) : (
                  <button
                    onClick={handleSend}
                    disabled={!input.trim()}
                    className={`p-2.5 rounded-xl transition-all duration-200 mb-0.5 active:scale-90 shadow-sm ${
                      input.trim()
                        ? 'bg-gradient-to-r from-ink to-ink-light text-white hover:shadow-lg hover:shadow-ink/30'
                        : 'bg-ivory-deep text-muted/40 cursor-not-allowed'
                    }`}
                  >
                    <Send size={16} className={input.trim() ? 'animate-send-pulse' : ''} />
                  </button>
                )}
              </div>
              <p className="text-[11px] text-center text-muted/50 mt-2.5 flex items-center justify-center gap-1.5 tracking-wide">
                <Sparkles size={9} className="text-amber/60" />
                AI 回答基于当前页面内容，由 DeepSeek 提供支持
              </p>
            </div>
          </>
        )}
      </div>
    </>
  );
}

// ==================== Sub Components ====================

function HeaderButton({
  active,
  onClick,
  title,
  icon,
}: {
  active?: boolean;
  onClick: () => void;
  title: string;
  icon: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-lg transition-all duration-200 active:scale-90 ${
        active
          ? 'bg-white/15 text-amber shadow-inner'
          : 'hover:bg-white/10 text-white/70 hover:text-white'
      }`}
      title={title}
    >
      {icon}
    </button>
  );
}

function MessageBubble({
  message,
  index,
  copiedId,
  onCopy,
  onRetry,
}: {
  message: ChatMessage;
  index: number;
  copiedId: string | null;
  onCopy: (content: string, id: string) => void;
  onRetry: (msg: ChatMessage) => void;
}) {
  const isUser = message.role === 'user';
  const isError = message.status === 'error';

  return (
    <div
      className={`flex gap-2.5 animate-fade-in-up group ${isUser ? 'flex-row-reverse' : ''}`}
      style={{ animationDelay: `${Math.min(index * 40, 200)}ms` }}
    >
      <div
        className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 shadow-md transition-transform duration-300 group-hover:scale-105 ${
          isUser
            ? 'bg-gradient-to-br from-ink to-ink-light text-white'
            : isError
            ? 'bg-rose-50 text-rose-500'
            : 'bg-gradient-to-br from-amber to-amber-deep text-ink'
        }`}
      >
        {isUser ? <User size={14} strokeWidth={2.5} /> : <Bot size={14} strokeWidth={2.5} />}
      </div>
      <div className={`max-w-[80%] ${isUser ? 'text-right' : ''}`}>
        <div
          className={`inline-block px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm transition-shadow duration-300 group-hover:shadow-md ${
            isUser
              ? 'bg-gradient-to-br from-ink to-ink-light text-white rounded-br-sm'
              : isError
              ? 'bg-rose-50/80 text-rose-700 rounded-bl-sm border border-rose-100'
              : 'bg-white text-charcoal rounded-bl-sm border border-amber/15'
          }`}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div className="markdown-content">{renderMarkdownToJSX(message.content)}</div>
          )}
        </div>

        {/* Message Actions */}
        <div
          className={`flex items-center gap-1.5 mt-1.5 transition-opacity duration-200 ${
            isUser ? 'justify-end' : 'opacity-100 sm:opacity-0 sm:group-hover:opacity-100'
          }`}
        >
          <span className="text-[10px] text-muted/60 tracking-wide">{formatTime(message.timestamp)}</span>
          {!isUser && (
            <>
              <button
                onClick={() => onCopy(message.content, message.id)}
                className="p-1 rounded-md hover:bg-amber/10 text-muted/60 hover:text-amber transition-colors"
                title="复制内容"
              >
                {copiedId === message.id ? (
                  <Check size={11} className="text-emerald-500" />
                ) : (
                  <Copy size={11} />
                )}
              </button>
              {isError && (
                <button
                  onClick={() => onRetry(message)}
                  className="p-1 rounded-md hover:bg-amber/10 text-muted/60 hover:text-amber transition-colors"
                  title="重试"
                >
                  <RotateCcw size={11} />
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function WelcomeView({
  section,
  quickQuestions,
  onSend,
  currentData,
}: {
  section: string;
  quickQuestions: string[];
  onSend: (content: string, data: ApiData) => Promise<void>;
  currentData: ApiData;
}) {
  const sectionMeta: Record<string, { title: string; desc: string; gradient: string; iconBg: string; iconText: string }> = {
    'daily-english': {
      title: '每日英语',
      desc: '深入理解单词的词源、用法和记忆技巧',
      gradient: 'from-amber/15 to-amber/5',
      iconBg: 'bg-amber/15',
      iconText: 'text-amber-deep',
    },
    'word-detail': {
      title: '单词详解',
      desc: '提供词汇的深度解析和拓展知识',
      gradient: 'from-sky-400/15 to-sky-400/5',
      iconBg: 'bg-sky-400/15',
      iconText: 'text-sky-600',
    },
    'driving-test': {
      title: '驾考练习',
      desc: '讲解考点、分析易错题目',
      gradient: 'from-emerald-500/15 to-emerald-500/5',
      iconBg: 'bg-emerald-500/15',
      iconText: 'text-emerald-600',
    },
    'today-history': {
      title: '历史上的今天',
      desc: '解读历史事件的背景和影响',
      gradient: 'from-purple-500/15 to-purple-500/5',
      iconBg: 'bg-purple-500/15',
      iconText: 'text-purple-600',
    },
    'sanguo-heroes': {
      title: '三国人物志',
      desc: '深度解析三国人物的生平与历史地位',
      gradient: 'from-rose-500/15 to-rose-500/5',
      iconBg: 'bg-rose-500/15',
      iconText: 'text-rose-600',
    },
    'translator': {
      title: '聚合翻译',
      desc: '提供翻译质量评估与语言学习建议',
      gradient: 'from-sky-500/15 to-sky-500/5',
      iconBg: 'bg-sky-500/15',
      iconText: 'text-sky-600',
    },
    'proverbs': {
      title: '随机谚语',
      desc: '深入解读谚语背后的文化内涵与人生智慧',
      gradient: 'from-amber/15 to-amber/5',
      iconBg: 'bg-amber/15',
      iconText: 'text-amber-deep',
    },
    'math-quiz': {
      title: '小学数学挑战',
      desc: '提供详细的解题思路与知识点讲解',
      gradient: 'from-teal/15 to-teal/5',
      iconBg: 'bg-teal/15',
      iconText: 'text-teal',
    },
    'poetry': {
      title: '古诗文大全',
      desc: '深度赏析古典诗词的意象、情感与文学价值',
      gradient: 'from-amber/15 to-amber/5',
      iconBg: 'bg-amber/15',
      iconText: 'text-amber-deep',
    },
    'chemical-element': {
      title: '元素周期表',
      desc: '深入解析化学元素的性质、应用与科学故事',
      gradient: 'from-emerald-500/15 to-emerald-500/5',
      iconBg: 'bg-emerald-500/15',
      iconText: 'text-emerald-600',
    },
    'idiom': {
      title: '成语字典',
      desc: '深入解读成语典故、字义演变与文化内涵',
      gradient: 'from-amber/15 to-amber/5',
      iconBg: 'bg-amber/15',
      iconText: 'text-amber-deep',
    },
  };

  const meta = sectionMeta[section] || {
    title: 'AI 学习助手',
    desc: '基于当前页面的学习内容为你答疑解惑',
    gradient: 'from-amber/15 to-amber/5',
    iconBg: 'bg-amber/15',
    iconText: 'text-amber-deep',
  };

  return (
    <div className="flex flex-col items-center justify-center py-10 px-4 animate-fade-in">
      <div className="relative mb-5">
        <div className="absolute inset-0 bg-amber/15 rounded-3xl blur-2xl scale-150" />
        <div
          className={`relative w-20 h-20 rounded-3xl bg-gradient-to-br ${meta.gradient} flex items-center justify-center shadow-glow-amber border border-amber/20`}
        >
          <Sparkles size={32} className="text-amber-deep" strokeWidth={1.5} />
        </div>
      </div>
      <h4 className="text-xl font-semibold text-ink mb-1.5 font-serif tracking-wide">{meta.title}</h4>
      <p className="text-sm text-muted/80 max-w-[240px] mx-auto leading-relaxed text-center">{meta.desc}</p>

      <div className="mt-10 space-y-2.5 w-full max-w-[340px]">
        <p className="text-[10.5px] text-muted/40 font-semibold uppercase tracking-[0.2em] mb-3 text-center flex items-center justify-center gap-2">
          <span className="w-6 h-px bg-gradient-to-r from-transparent to-amber/40" />
          推荐提问
          <span className="w-6 h-px bg-gradient-to-l from-transparent to-amber/40" />
        </p>
        {quickQuestions.map((q, i) => (
          <button
            key={i}
            onClick={() => onSend(q, currentData)}
            className="block w-full text-left px-4 py-3 text-sm bg-white rounded-2xl hover:bg-gradient-to-r hover:from-amber/8 hover:to-transparent hover:text-ink hover:shadow-md hover:border-amber/20 transition-all duration-300 text-muted/75 border border-line-soft active:scale-[0.98] group"
          >
            <span className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-lg bg-amber/12 text-amber-deep flex items-center justify-center text-[10px] font-bold flex-shrink-0 group-hover:bg-gradient-to-br group-hover:from-amber group-hover:to-amber-deep group-hover:text-white transition-all duration-300 shadow-sm">
                {i + 1}
              </span>
              <span className="leading-relaxed">{q}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function HistoryView({
  messages,
  onClose,
  onSelectMessage,
}: {
  messages: ChatMessage[];
  onClose: () => void;
  onSelectMessage: () => void;
}) {
  const groups: { date: string; messages: ChatMessage[] }[] = [];
  let currentGroup: { date: string; messages: ChatMessage[] } | null = null;

  messages.forEach((msg) => {
    const date = new Date(msg.timestamp);
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

    if (!currentGroup || currentGroup.date !== dateStr) {
      currentGroup = { date: dateStr, messages: [] };
      groups.push(currentGroup);
    }
    currentGroup.messages.push(msg);
  });

  return (
    <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
      <button
        onClick={onClose}
        className="flex items-center gap-1.5 text-sm text-muted/65 hover:text-ink mb-6 transition-colors duration-200 group"
      >
        <ChevronDown size={16} className="rotate-90 group-hover:-translate-x-0.5 transition-transform" />
        返回对话
      </button>

      {messages.length === 0 ? (
        <div className="text-center text-muted/40 py-20">
          <div className="relative inline-block mb-4">
            <div className="absolute inset-0 bg-amber/10 rounded-2xl blur-xl scale-150" />
            <div className="relative w-16 h-16 rounded-2xl bg-amber/8 flex items-center justify-center border border-amber/15">
              <History size={28} className="text-amber-deep/60" />
            </div>
          </div>
          <p className="text-sm font-medium">暂无对话历史</p>
          <p className="text-xs mt-1.5 opacity-50">开始提问，记录你的学习轨迹</p>
        </div>
      ) : (
        <div className="space-y-8">
          {groups.map((group) => (
            <div key={group.date}>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber/25 to-transparent" />
                <span className="text-[10px] text-muted/45 uppercase tracking-[0.2em] font-medium">
                  {group.date}
                </span>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber/25 to-transparent" />
              </div>
              <div className="space-y-2.5">
                {group.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className="p-4 rounded-2xl bg-white border border-amber/12 cursor-pointer hover:border-amber/30 hover:shadow-md transition-all duration-300 active:scale-[0.99]"
                    onClick={onSelectMessage}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${
                          msg.role === 'user'
                            ? 'bg-ink/8 text-ink'
                            : msg.status === 'error'
                            ? 'bg-rose-50 text-rose-500'
                            : 'bg-amber/15 text-amber-deep'
                        }`}
                      >
                        {msg.role === 'user' ? '我' : 'AI'}
                      </span>
                      <span className="text-[10px] text-muted/45">{formatFullDate(msg.timestamp)}</span>
                    </div>
                    <p className="text-sm text-charcoal/80 line-clamp-2 leading-relaxed">{msg.content}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
