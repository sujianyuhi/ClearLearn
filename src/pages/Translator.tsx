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
  Zap,
  History,
} from 'lucide-react';
import type { TranslatorData } from '../types';
import ChatPanel from '../components/ChatPanel';
import { PageHeader, ErrorState, SectionTitle, ActionButton } from '../components/UI';

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
      <PageHeader
        icon={Languages}
        title="聚合翻译"
        description="支持 13 种语言互译，让沟通无国界"
        accent="amber"
      >
        {history.length > 0 && (
          <ActionButton
            onClick={() => setShowHistory(!showHistory)}
            variant="ghost"
            size="md"
            icon={<History size={15} />}
          >
            历史记录
            <span className="text-xs text-muted/60 bg-ivory px-1.5 py-0.5 rounded-md ml-0.5">
              {history.length}
            </span>
          </ActionButton>
        )}
      </PageHeader>

      {/* Main Translator Card */}
      <div className="bg-white rounded-2xl shadow-card border border-line-soft overflow-hidden mb-6">
        {/* Language Bar */}
        <div className="relative flex items-center justify-between px-6 py-4 border-b border-line-soft bg-gradient-to-r from-ivory/60 to-ivory-soft/40">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-amber/15 shadow-sm">
              <span className="w-5 h-5 rounded-md bg-amber/15 text-amber-deep flex items-center justify-center">
                <Globe size={11} />
              </span>
              <span className="text-sm font-medium text-ink">自动检测</span>
            </div>
          </div>

          <button
            onClick={handleSwapLang}
            disabled={!result}
            title="交换语言"
            className={`relative p-2.5 rounded-xl transition-all duration-200 active:scale-90 ${
              result
                ? 'bg-gradient-to-br from-amber to-amber-deep text-white border border-amber/30 shadow-md hover:shadow-lg'
                : 'bg-ivory text-muted/30 border border-line cursor-not-allowed'
            }`}
          >
            <ArrowRightLeft size={16} />
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
                <path d="M1 1.5L6 6.5L11 1.5" stroke="#B98A5A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>

        {/* Input & Output */}
        <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-line-soft">
          {/* Source Input */}
          <div className="p-6 relative">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-ink/8 text-ink/70 flex items-center justify-center">
                  <Languages size={12} />
                </span>
                <span className="text-xs font-semibold text-muted uppercase tracking-wider">原文</span>
              </div>
              {sourceText && (
                <button
                  onClick={() => setSourceText('')}
                  className="p-1 rounded-md hover:bg-amber/10 text-muted/40 hover:text-amber transition-colors"
                  title="清空"
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
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-line-soft/60">
              <span className="text-xs text-muted/50 font-mono">{sourceText.length} 字</span>
              <ActionButton
                onClick={handleTranslate}
                disabled={!sourceText.trim()}
                loading={loading}
                variant="primary"
                size="md"
                icon={<Send size={14} />}
              >
                翻译
              </ActionButton>
            </div>
          </div>

          {/* Target Output */}
          <div className="p-6 bg-gradient-to-br from-ivory/40 to-ivory-soft/30 relative">
            <div className="absolute top-4 right-4 flex items-center gap-1 opacity-0 hover:opacity-100 focus-within:opacity-100 transition-opacity">
              {result && (
                <>
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
                    {copiedId === 'result' ? <Check size={15} className="text-emerald-500" /> : <Copy size={15} />}
                  </button>
                </>
              )}
            </div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded-md bg-amber/15 text-amber-deep flex items-center justify-center">
                <Globe size={12} />
              </span>
              <span className="text-xs font-semibold text-muted uppercase tracking-wider">
                {getLangFlag(targetLang)} {getLangLabel(targetLang)}
              </span>
            </div>
            {result ? (
              <div className="animate-fade-in-up">
                <p className="text-charcoal text-base leading-relaxed whitespace-pre-wrap">
                  {result.translatedText}
                </p>
                <div className="mt-4 pt-3 border-t border-line-soft/60 flex items-center gap-1">
                  <button
                    onClick={() => handleSpeak(result.translatedText, LANG_OPTIONS.find((l) => l.value === result.targetLang)?.code || 'zh')}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs text-muted/60 hover:text-amber hover:bg-amber/8 transition-colors"
                  >
                    <Volume2 size={12} />
                    朗读
                  </button>
                  <button
                    onClick={() => handleCopy(result.translatedText, 'result')}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs text-muted/60 hover:text-amber hover:bg-amber/8 transition-colors"
                  >
                    {copiedId === 'result' ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                    {copiedId === 'result' ? '已复制' : '复制'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-muted/30">
                <div className="relative mb-3">
                  <div className="absolute inset-0 bg-amber/15 rounded-2xl blur-lg scale-150" />
                  <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-amber/10 to-amber/5 flex items-center justify-center border border-amber/15">
                    <Languages size={26} strokeWidth={1.5} className="text-amber-deep" />
                  </div>
                </div>
                <p className="text-sm">翻译结果将显示在这里</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Error */}
      {error && <ErrorState message={error} onRetry={handleTranslate} retryText="重新翻译" />}

      {/* Hot Examples */}
      {!result && !loading && (
        <div className="bg-white rounded-2xl p-6 shadow-card border border-line-soft mb-6 animate-fade-in-up">
          <SectionTitle
            icon={Sparkles}
            title="热门示例"
            accent="amber"
            count={HOT_EXAMPLES.length}
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {HOT_EXAMPLES.map((example, index) => (
              <button
                key={index}
                onClick={() => {
                  setSourceText(example.text);
                  setTargetLang(example.type);
                  setTimeout(() => translate(example.text, example.type), 0);
                }}
                className="text-left p-4 rounded-xl bg-gradient-to-br from-ivory/60 to-ivory-soft/40 border border-amber/8 hover:border-amber/30 hover:shadow-md transition-all duration-200 group active:scale-[0.98]"
              >
                <p className="text-charcoal text-sm font-medium mb-2 group-hover:text-ink transition-colors">
                  {example.text}
                </p>
                <span className="inline-flex items-center gap-1 text-xs text-muted/70 bg-white px-2 py-1 rounded-md border border-amber/10 group-hover:border-amber/25 transition-colors">
                  <ArrowRightLeft size={10} className="text-amber" />
                  译成{getLangLabel(example.type)}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Translation Result Detail */}
      {result && !loading && (
        <div className="bg-white rounded-2xl p-6 shadow-card border border-line-soft mb-6 animate-fade-in-up">
          <SectionTitle
            icon={Zap}
            title="翻译详情"
            accent="amber"
          />
          <div className="space-y-3">
            {/* Source */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-ivory/60 to-ivory-soft/40 border border-ink/8">
              <div className="flex items-center gap-2 mb-2.5">
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-ink bg-white px-2.5 py-1 rounded-md border border-ink/10">
                  <Languages size={11} />
                  原文
                </span>
              </div>
              <p className="text-charcoal leading-relaxed">{result.sourceText}</p>
            </div>

            {/* Arrow */}
            <div className="flex justify-center py-1">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber/15 to-amber/5 border border-amber/20 flex items-center justify-center">
                <ArrowRightLeft size={14} className="text-amber-deep" />
              </div>
            </div>

            {/* Target */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-amber/8 to-transparent border border-amber/15">
              <div className="flex items-center gap-2 mb-2.5">
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-white bg-gradient-to-br from-amber to-amber-deep px-2.5 py-1 rounded-md">
                  {getLangFlag(result.targetLang)} {getLangLabel(result.targetLang)}
                </span>
              </div>
              <p className="text-ink text-lg font-medium leading-relaxed">{result.translatedText}</p>
            </div>
          </div>
        </div>
      )}

      {/* History */}
      {history.length > 0 && showHistory && (
        <div className="bg-white rounded-2xl shadow-card border border-line-soft overflow-hidden mb-6 animate-fade-in-up">
          <div className="px-6 py-4 bg-gradient-to-r from-ivory/60 to-ivory-soft/40 border-b border-line-soft">
            <div className="flex items-center justify-between">
              <SectionTitle
                icon={Clock}
                title="翻译历史"
                accent="amber"
                count={history.length}
              />
              <button
                onClick={clearHistory}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-muted/60 hover:text-rose-500 hover:bg-rose-50 transition-all duration-200"
                title="清空历史"
              >
                <Trash2 size={12} />
                清空
              </button>
            </div>
          </div>

          <div className="divide-y divide-line-soft max-h-96 overflow-y-auto scrollbar-thin">
            {history.map((item) => (
              <div
                key={item.id}
                className="px-6 py-4 hover:bg-gradient-to-r hover:from-ivory/30 hover:to-transparent transition-colors group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-charcoal truncate">{item.sourceText}</p>
                    <p className="text-sm text-ink font-medium mt-1.5">{item.translatedText}</p>
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
                      {copiedId === item.id ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2.5">
                  <span className="text-[10px] text-muted/60 bg-white px-2 py-0.5 rounded-md border border-line-soft font-medium">
                    {getLangFlag(item.targetLang)} {getLangLabel(item.targetLang)}
                  </span>
                  <span className="text-[10px] text-muted/40 font-mono">
                    {new Date(item.timestamp).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <ChatPanel section="translator" currentData={currentData} />
    </div>
  );
}
