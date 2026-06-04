import { useState, useCallback, useRef, useEffect } from 'react';
import {
  Languages,
  ArrowRightLeft,
  Copy,
  Check,
  Sparkles,
  Globe,
  Clock,
  X,
  Send,
  Volume2,
  Trash2,
} from 'lucide-react';
import type { TranslatorData } from '../types';
import ChatPanel from '../components/ChatPanel';

const API_URL = 'https://cn.apihz.cn/api/zici/fanyi.php?id=10017576&key=1356a3698c81abe43c2eacb627cb6c91';

const LANG_OPTIONS = [
  { value: 1, label: '中文', flag: '🇨🇳', code: 'zh' },
  { value: 2, label: '英文', flag: '🇬🇧', code: 'en' },
  { value: 3, label: '繁体中文', flag: '🇭🇰', code: 'zht' },
  { value: 4, label: '日语', flag: '🇯🇵', code: 'ja' },
  { value: 5, label: '韩语', flag: '🇰🇷', code: 'ko' },
  { value: 6, label: '法语', flag: '🇫🇷', code: 'fr' },
  { value: 7, label: '西班牙语', flag: '🇪🇸', code: 'es' },
  { value: 8, label: '泰语', flag: '🇹🇭', code: 'th' },
  { value: 9, label: '阿拉伯语', flag: '🇸🇦', code: 'ar' },
  { value: 10, label: '俄语', flag: '🇷🇺', code: 'ru' },
  { value: 11, label: '葡萄牙语', flag: '🇵🇹', code: 'pt' },
  { value: 12, label: '德语', flag: '🇩🇪', code: 'de' },
  { value: 13, label: '意大利语', flag: '🇮🇹', code: 'it' },
];

const HOT_EXAMPLES = [
  { text: '你好，世界', type: 2 },
  { text: 'Hello World', type: 1 },
  { text: '千里之行，始于足下', type: 2 },
  { text: 'To be or not to be', type: 1 },
  { text: '我爱你', type: 4 },
  { text: '사랑해요', type: 1 },
];

interface HistoryItem {
  id: string;
  sourceText: string;
  translatedText: string;
  targetLang: number;
  timestamp: number;
}

function getLangLabel(value: number): string {
  return LANG_OPTIONS.find((l) => l.value === value)?.label || '未知';
}

function getLangFlag(value: number): string {
  return LANG_OPTIONS.find((l) => l.value === value)?.flag || '🌐';
}

export default function Translator() {
  const [sourceText, setSourceText] = useState('');
  const [targetLang, setTargetLang] = useState(2);
  const [result, setResult] = useState<TranslatorData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('translator_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    localStorage.setItem('translator_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [sourceText]);

  const translate = useCallback(async (text: string, lang: number) => {
    if (!text.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_URL}&words=${encodeURIComponent(text.trim())}&type=${lang}`,
        { headers: { Accept: 'application/json' } }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.code !== 200 && data.code !== '200') {
        throw new Error(data.msg || '翻译失败');
      }

      const translated = data.words || '';
      const newResult: TranslatorData = {
        sourceText: text.trim(),
        translatedText: translated,
        targetLang: lang,
      };

      setResult(newResult);

      setHistory((prev) => {
        const filtered = prev.filter((h) => h.sourceText !== text.trim() || h.targetLang !== lang);
        const newItem: HistoryItem = {
          id: Date.now().toString(),
          sourceText: text.trim(),
          translatedText: translated,
          targetLang: lang,
          timestamp: Date.now(),
        };
        return [newItem, ...filtered].slice(0, 50);
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : '翻译出错');
      setResult(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleTranslate = useCallback(() => {
    translate(sourceText, targetLang);
  }, [sourceText, targetLang, translate]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        handleTranslate();
      }
    },
    [handleTranslate]
  );

  const handleSwapLang = useCallback(() => {
    if (result) {
      setSourceText(result.translatedText);
      const detectedSource = result.targetLang === 1 ? 2 : 1;
      setTargetLang(detectedSource);
      translate(result.translatedText, detectedSource);
    }
  }, [result, translate]);

  const handleCopy = useCallback(async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  const handleSpeak = useCallback((text: string, langCode: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCode;
    utterance.rate = 0.9;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem('translator_history');
  }, []);

  const currentData: TranslatorData | null = result;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-amber/20 flex items-center justify-center">
            <Languages size={20} className="text-amber" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-ink font-serif">聚合翻译</h1>
            <p className="text-sm text-muted">支持 13 种语言互译，让沟通无国界</p>
          </div>
        </div>
      </div>

      {/* Main Translator Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        {/* Language Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-[#FAF8F5]">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-amber/15 shadow-sm">
              <Globe size={16} className="text-amber" />
              <span className="text-sm font-medium text-ink">自动检测</span>
            </div>
          </div>

          <button
            onClick={handleSwapLang}
            disabled={!result}
            className={`p-2 rounded-xl transition-all duration-200 active:scale-90 ${
              result
                ? 'bg-white text-amber hover:bg-amber hover:text-white border border-amber/20 shadow-sm'
                : 'bg-gray-100 text-gray-300 cursor-not-allowed'
            }`}
            title="交换语言"
          >
            <ArrowRightLeft size={18} />
          </button>

          <div className="relative">
            <select
              value={targetLang}
              onChange={(e) => setTargetLang(Number(e.target.value))}
              className="appearance-none px-4 py-2 pr-10 bg-white rounded-xl border border-amber/15 text-sm font-medium text-ink shadow-sm cursor-pointer hover:border-amber/40 transition-colors focus:outline-none focus:ring-2 focus:ring-amber/20"
            >
              {LANG_OPTIONS.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.flag} {lang.label}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                <path d="M1 1.5L6 6.5L11 1.5" stroke="#D4A574" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>

        {/* Input & Output */}
        <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
          {/* Source Input */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-muted/60 uppercase tracking-wider">原文</span>
              {sourceText && (
                <button
                  onClick={() => setSourceText('')}
                  className="p-1 rounded-md hover:bg-amber/10 text-muted/40 hover:text-amber transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            <textarea
              ref={textareaRef}
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="输入要翻译的文本..."
              rows={4}
              className="w-full bg-transparent outline-none text-charcoal text-base leading-relaxed placeholder:text-muted/40 resize-none"
            />
            <div className="flex items-center justify-between mt-4">
              <span className="text-xs text-muted/40">{sourceText.length} 字</span>
              <button
                onClick={handleTranslate}
                disabled={loading || !sourceText.trim()}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 active:scale-95 shadow-sm ${
                  sourceText.trim() && !loading
                    ? 'bg-ink text-white hover:bg-ink/90'
                    : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    翻译中...
                  </>
                ) : (
                  <>
                    <Send size={15} />
                    翻译
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Target Output */}
          <div className="p-6 bg-[#FAF8F5]/50">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-muted/60 uppercase tracking-wider">
                {getLangFlag(targetLang)} {getLangLabel(targetLang)}
              </span>
              {result && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleSpeak(result.translatedText, LANG_OPTIONS.find((l) => l.value === result.targetLang)?.code || 'zh')}
                    className="p-1.5 rounded-md hover:bg-amber/10 text-muted/40 hover:text-amber transition-colors"
                    title="朗读"
                  >
                    <Volume2 size={15} />
                  </button>
                  <button
                    onClick={() => handleCopy(result.translatedText, 'result')}
                    className="p-1.5 rounded-md hover:bg-amber/10 text-muted/40 hover:text-amber transition-colors"
                    title="复制"
                  >
                    {copiedId === 'result' ? <Check size={15} className="text-green-500" /> : <Copy size={15} />}
                  </button>
                </div>
              )}
            </div>
            {result ? (
              <div className="animate-fade-in-up">
                <p className="text-charcoal text-base leading-relaxed whitespace-pre-wrap">{result.translatedText}</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-muted/30">
                <Languages size={36} strokeWidth={1.5} />
                <p className="text-sm mt-3">翻译结果将显示在这里</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-6 flex items-center gap-3 animate-fade-in-up">
          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
            <X size={16} className="text-red-500" />
          </div>
          <div className="flex-1">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
          <button
            onClick={handleTranslate}
            className="px-3 py-1.5 bg-ink text-white rounded-lg text-xs hover:bg-ink/90 transition-colors"
          >
            重试
          </button>
        </div>
      )}

      {/* Hot Examples */}
      {!result && !loading && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6 animate-fade-in-up">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={16} className="text-amber" />
            <h3 className="text-sm font-semibold text-ink">热门示例</h3>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {HOT_EXAMPLES.map((example, index) => (
              <button
                key={index}
                onClick={() => {
                  setSourceText(example.text);
                  setTargetLang(example.type);
                  setTimeout(() => translate(example.text, example.type), 0);
                }}
                className="text-left p-4 rounded-xl bg-[#FAF8F5] border border-transparent hover:border-amber/20 hover:shadow-md transition-all duration-200 group active:scale-[0.98]"
              >
                <p className="text-charcoal text-sm font-medium mb-1.5 group-hover:text-ink transition-colors">
                  {example.text}
                </p>
                <span className="inline-flex items-center gap-1 text-xs text-muted/60 bg-white px-2 py-0.5 rounded-md border border-amber/10">
                  <ArrowRightLeft size={10} className="text-amber" />
                  译成{getLangLabel(example.type)}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Translation Result Detail */}
      {result && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6 animate-fade-in-up">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-lg bg-amber/15 flex items-center justify-center">
              <Globe size={16} className="text-amber" />
            </div>
            <h3 className="text-lg font-bold text-ink font-serif">翻译详情</h3>
          </div>

          <div className="space-y-4">
            {/* Source */}
            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-amber/8">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-amber bg-amber/15 px-2 py-0.5 rounded-md">原文</span>
              </div>
              <p className="text-charcoal leading-relaxed">{result.sourceText}</p>
            </div>

            {/* Arrow */}
            <div className="flex justify-center">
              <div className="w-8 h-8 rounded-full bg-ink/5 flex items-center justify-center">
                <ArrowRightLeft size={14} className="text-ink/40" />
              </div>
            </div>

            {/* Target */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-amber/5 to-transparent border border-amber/15">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-white bg-amber px-2 py-0.5 rounded-md">
                  {getLangFlag(result.targetLang)} {getLangLabel(result.targetLang)}
                </span>
              </div>
              <p className="text-ink text-lg font-medium leading-relaxed">{result.translatedText}</p>
            </div>
          </div>
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-[#FAF8F5] transition-colors"
          >
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-amber" />
              <h3 className="text-sm font-semibold text-ink">翻译历史</h3>
              <span className="text-xs text-muted/50 bg-ivory px-2 py-0.5 rounded-full">{history.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  clearHistory();
                }}
                className="p-1.5 rounded-md hover:bg-red-50 text-muted/40 hover:text-red-500 transition-colors"
                title="清空历史"
              >
                <Trash2 size={14} />
              </button>
              <svg
                width="12"
                height="8"
                viewBox="0 0 12 8"
                fill="none"
                className={`text-muted/40 transition-transform duration-300 ${showHistory ? 'rotate-180' : ''}`}
              >
                <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </button>

          {showHistory && (
            <div className="border-t border-gray-100 divide-y divide-gray-50 max-h-96 overflow-y-auto scrollbar-thin">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="px-6 py-4 hover:bg-[#FAF8F5] transition-colors group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-charcoal truncate">{item.sourceText}</p>
                      <p className="text-sm text-ink font-medium mt-1">{item.translatedText}</p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          setSourceText(item.sourceText);
                          setTargetLang(item.targetLang);
                          translate(item.sourceText, item.targetLang);
                        }}
                        className="p-1.5 rounded-md hover:bg-amber/10 text-muted/40 hover:text-amber transition-colors"
                        title="再次翻译"
                      >
                        <ArrowRightLeft size={14} />
                      </button>
                      <button
                        onClick={() => handleCopy(item.translatedText, item.id)}
                        className="p-1.5 rounded-md hover:bg-amber/10 text-muted/40 hover:text-amber transition-colors"
                        title="复制"
                      >
                        {copiedId === item.id ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] text-muted/40 bg-white px-2 py-0.5 rounded-md border border-gray-100">
                      {getLangFlag(item.targetLang)} {getLangLabel(item.targetLang)}
                    </span>
                    <span className="text-[10px] text-muted/30">
                      {new Date(item.timestamp).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <ChatPanel section="translator" currentData={currentData} />
    </div>
  );
}
