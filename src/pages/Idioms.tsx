import { useState, useEffect, useCallback } from 'react';
import {
  RefreshCw,
  Quote,
  BookMarked,
  Lightbulb,
  ScrollText,
  Languages,
  AlignLeft,
  Repeat,
  ArrowLeftRight,
  FileText,
  Stamp,
  Puzzle,
  Sparkles,
} from 'lucide-react';
import type { IdiomData } from '../types';
import LoadingCard from '../components/LoadingCard';
import ChatPanel from '../components/ChatPanel';

export default function Idioms() {
  const [data, setData] = useState<IdiomData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchIdiom = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        'https://cn.apihz.cn/api/zici/sjcy.php?id=10017576&key=1356a3698c81abe43c2eacb627cb6c91',
        { headers: { Accept: 'application/json' } }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      if (result.code !== 200 && result.code !== '200') {
        throw new Error(result.msg || 'API返回错误');
      }
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知错误');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchIdiom();
  }, [fetchIdiom]);

  const hasDetail = (value?: string) => !!value && value.trim() !== '' && value !== '暂无' && value !== '无';

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-amber/20 flex items-center justify-center">
            <Sparkles size={20} className="text-amber" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-ink font-serif">随机成语</h1>
            <p className="text-sm text-muted">探寻中华成语之美，领略千年文化智慧</p>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading && !data && <LoadingCard />}

      {error && !data && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600 mb-3">{error}</p>
          <button
            onClick={fetchIdiom}
            className="px-4 py-2 bg-ink text-white rounded-lg text-sm hover:bg-ink/90 transition-colors"
          >
            重新加载
          </button>
        </div>
      )}

      {data && (
        <div key={data.words} className="space-y-5 animate-fade-in-up">
          {/* Main Idiom Hero Card */}
          <div className="relative bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-gray-100 overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-36 h-36 bg-ink/5 rounded-full translate-y-1/2 -translate-x-1/2" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber/[0.02] rounded-full" />

            <div className="relative">
              {/* Top Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-14 h-14 rounded-full bg-amber/15 flex items-center justify-center">
                  <Quote size={28} className="text-amber" />
                </div>
              </div>

              {/* Idiom Text */}
              <div className="text-center mb-4">
                <h2 className="text-4xl md:text-5xl font-bold text-ink font-serif leading-relaxed tracking-[0.2em]">
                  {data.words}
                </h2>
              </div>

              {/* Pinyin */}
              <div className="text-center mb-6">
                <span className="inline-block px-4 py-1.5 bg-amber/10 text-amber rounded-full text-sm font-medium tracking-wider">
                  {data.pinyin}
                </span>
              </div>

              {/* Divider */}
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="h-px w-12 bg-amber/30" />
                <div className="w-2 h-2 rounded-full bg-amber/50" />
                <div className="h-px w-12 bg-amber/30" />
              </div>

              {/* Basic Info Tags */}
              <div className="flex flex-wrap justify-center gap-3 mb-2">
                {hasDetail(data.shouzi) && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-ivory rounded-lg text-sm text-charcoal">
                    <span className="text-muted text-xs">首字</span>
                    <span className="font-medium text-ink">{data.shouzi}</span>
                  </div>
                )}
                {hasDetail(data.bushou) && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-ivory rounded-lg text-sm text-charcoal">
                    <span className="text-muted text-xs">部首</span>
                    <span className="font-medium text-ink">{data.bushou}</span>
                  </div>
                )}
                {hasDetail(data.en) && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-ivory rounded-lg text-sm text-charcoal">
                    <Languages size={13} className="text-amber" />
                    <span className="font-medium text-ink">{data.en}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Explanation */}
          {hasDetail(data.jieshi) && (
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-amber/10 flex items-center justify-center">
                  <Lightbulb size={16} className="text-amber" />
                </div>
                <h3 className="text-base font-medium text-ink font-serif">释义</h3>
              </div>
              <p className="text-charcoal leading-relaxed text-base">{data.jieshi}</p>
            </div>
          )}

          {/* Origin & Grammar Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {hasDetail(data.chuchu) && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-ink/10 flex items-center justify-center">
                    <ScrollText size={16} className="text-ink" />
                  </div>
                  <h3 className="text-base font-medium text-ink font-serif">出处</h3>
                </div>
                <p className="text-charcoal leading-relaxed text-sm">{data.chuchu}</p>
              </div>
            )}
            {hasDetail(data.yufa) && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-ink/10 flex items-center justify-center">
                    <Puzzle size={16} className="text-ink" />
                  </div>
                  <h3 className="text-base font-medium text-ink font-serif">语法</h3>
                </div>
                <p className="text-charcoal leading-relaxed text-sm">{data.yufa}</p>
              </div>
            )}
          </div>

          {/* Example Sentence */}
          {hasDetail(data.liju) && (
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-amber/10 flex items-center justify-center">
                  <FileText size={16} className="text-amber" />
                </div>
                <h3 className="text-base font-medium text-ink font-serif">例句</h3>
              </div>
              <div className="bg-ivory rounded-xl p-5 border-l-4 border-amber/40">
                <p className="text-charcoal leading-relaxed text-base font-serif">{data.liju}</p>
              </div>
            </div>
          )}

          {/* Synonyms & Antonyms Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {hasDetail(data.tongyi) && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                    <Repeat size={16} className="text-emerald-600" />
                  </div>
                  <h3 className="text-base font-medium text-ink font-serif">同义词</h3>
                </div>
                <p className="text-charcoal leading-relaxed text-sm">{data.tongyi}</p>
              </div>
            )}
            {hasDetail(data.fanyi) && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center">
                    <ArrowLeftRight size={16} className="text-rose-600" />
                  </div>
                  <h3 className="text-base font-medium text-ink font-serif">反义词</h3>
                </div>
                <p className="text-charcoal leading-relaxed text-sm">{data.fanyi}</p>
              </div>
            )}
          </div>

          {/* Verification & English Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {hasDetail(data.yinzheng) && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-amber/10 flex items-center justify-center">
                    <Stamp size={16} className="text-amber" />
                  </div>
                  <h3 className="text-base font-medium text-ink font-serif">印证</h3>
                </div>
                <p className="text-charcoal leading-relaxed text-sm">{data.yinzheng}</p>
              </div>
            )}
            {hasDetail(data.en) && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <AlignLeft size={16} className="text-blue-600" />
                  </div>
                  <h3 className="text-base font-medium text-ink font-serif">英文翻译</h3>
                </div>
                <p className="text-charcoal leading-relaxed text-sm italic">{data.en}</p>
              </div>
            )}
          </div>

          {/* Action Bar */}
          <div className="flex justify-center pt-4 pb-2">
            <button
              onClick={fetchIdiom}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-ink text-white rounded-xl hover:bg-ink/90 transition-all duration-200 text-sm shadow-md hover:shadow-lg active:scale-95 disabled:opacity-60"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              <span>换一个成语</span>
            </button>
          </div>

          {/* Cultural Note */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <BookMarked size={18} className="text-amber" />
              </div>
              <div>
                <h3 className="text-base font-medium text-ink mb-2 font-serif">关于成语</h3>
                <p className="text-muted text-sm leading-relaxed">
                  成语是汉语中经过长期使用、锤炼而形成的固定短语，是中国传统文化的一大特色。
                  它们多源自古代经典、历史故事或民间传说，往往四字成句，言简意赅，蕴含着丰富的历史典故和深刻的人生哲理。
                  学习成语，不仅能够提升语言表达能力，更是了解中华历史文化的窗口。
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <ChatPanel section="idioms" currentData={data} />
    </div>
  );
}
