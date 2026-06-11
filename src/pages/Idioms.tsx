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
import { PageHeader, ErrorState, OrnamentDivider, ActionButton } from '../components/UI';

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
      <PageHeader
        icon={Sparkles}
        title="随机成语"
        description="探寻中华成语之美，领略千年文化智慧"
        accent="amber"
      >
        <ActionButton
          onClick={fetchIdiom}
          loading={loading}
          variant="secondary"
          size="md"
          icon={<RefreshCw size={15} className={loading ? 'animate-spin' : ''} />}
        >
          换一词
        </ActionButton>
      </PageHeader>

      {/* Content */}
      {loading && !data && <LoadingCard />}

      {error && !data && <ErrorState message={error} onRetry={fetchIdiom} />}

      {data && (
        <div key={data.words} className="space-y-5 stagger-children">
          {/* Main Idiom Hero Card */}
          <div className="relative bg-white rounded-2xl p-8 md:p-12 shadow-card border border-line-soft overflow-hidden corner-accent group/card">
            {/* Decorative Background */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover/card:bg-amber/8 transition-colors duration-700" />
            <div className="absolute bottom-0 left-0 w-36 h-36 bg-ink/5 rounded-full translate-y-1/2 -translate-x-1/4 group-hover/card:bg-ink/8 transition-colors duration-700" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber/[0.02] rounded-full blur-2xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-1000" />

            <div className="relative">
              {/* Top Icon */}
              <div className="flex justify-center mb-6">
                <div className="relative group/icon">
                  <div className="absolute inset-0 bg-amber/30 rounded-full blur-xl scale-150 group-hover/icon:bg-amber/40 group-hover/icon:scale-[1.8] transition-all duration-700" />
                  <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-amber/20 to-amber/5 flex items-center justify-center border border-amber/20 group-hover/icon:border-amber/40 group-hover/icon:shadow-glow-amber transition-all duration-500">
                    <Quote size={28} className="text-amber-deep group-hover/icon:scale-110 transition-transform duration-500" />
                  </div>
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
                <span className="inline-block px-4 py-1.5 bg-amber/10 text-amber-deep rounded-full text-sm font-medium tracking-wider">
                  {data.pinyin}
                </span>
              </div>

              {/* Divider */}
              <OrnamentDivider className="my-6" />

              {/* Basic Info Tags */}
              <div className="flex flex-wrap justify-center gap-3 mb-2">
                {hasDetail(data.shouzi) && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-ivory rounded-lg text-sm text-charcoal border border-line-soft">
                    <span className="text-muted text-xs">首字</span>
                    <span className="font-medium text-ink">{data.shouzi}</span>
                  </div>
                )}
                {hasDetail(data.bushou) && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-ivory rounded-lg text-sm text-charcoal border border-line-soft">
                    <span className="text-muted text-xs">部首</span>
                    <span className="font-medium text-ink">{data.bushou}</span>
                  </div>
                )}
                {hasDetail(data.en) && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-ivory rounded-lg text-sm text-charcoal border border-line-soft">
                    <Languages size={13} className="text-amber-deep" />
                    <span className="font-medium text-ink">{data.en}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Explanation */}
          {hasDetail(data.jieshi) && (
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-card border border-line-soft">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg bg-amber/15 flex items-center justify-center">
                  <Lightbulb size={16} className="text-amber-deep" />
                </div>
                <h3 className="text-base font-semibold text-ink font-serif">释义</h3>
              </div>
              <p className="text-charcoal leading-relaxed text-base">{data.jieshi}</p>
            </div>
          )}

          {/* Origin & Grammar Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {hasDetail(data.chuchu) && (
              <div className="bg-white rounded-2xl p-6 shadow-card border border-line-soft">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-ink/10 flex items-center justify-center">
                    <ScrollText size={16} className="text-ink" />
                  </div>
                  <h3 className="text-base font-semibold text-ink font-serif">出处</h3>
                </div>
                <p className="text-charcoal leading-relaxed text-sm">{data.chuchu}</p>
              </div>
            )}
            {hasDetail(data.yufa) && (
              <div className="bg-white rounded-2xl p-6 shadow-card border border-line-soft">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-ink/10 flex items-center justify-center">
                    <Puzzle size={16} className="text-ink" />
                  </div>
                  <h3 className="text-base font-semibold text-ink font-serif">语法</h3>
                </div>
                <p className="text-charcoal leading-relaxed text-sm">{data.yufa}</p>
              </div>
            )}
          </div>

          {/* Example Sentence */}
          {hasDetail(data.liju) && (
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-card border border-line-soft">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg bg-amber/15 flex items-center justify-center">
                  <FileText size={16} className="text-amber-deep" />
                </div>
                <h3 className="text-base font-semibold text-ink font-serif">例句</h3>
              </div>
              <div className="bg-ivory rounded-xl p-5 border-l-4 border-amber/40 relative">
                <Quote size={20} className="absolute top-3 right-3 text-amber/20" />
                <p className="text-charcoal leading-relaxed text-base font-serif">{data.liju}</p>
              </div>
            </div>
          )}

          {/* Synonyms & Antonyms Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {hasDetail(data.tongyi) && (
              <div className="bg-white rounded-2xl p-6 shadow-card border border-line-soft">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                    <Repeat size={16} className="text-emerald-600" />
                  </div>
                  <h3 className="text-base font-semibold text-ink font-serif">同义词</h3>
                </div>
                <p className="text-charcoal leading-relaxed text-sm">{data.tongyi}</p>
              </div>
            )}
            {hasDetail(data.fanyi) && (
              <div className="bg-white rounded-2xl p-6 shadow-card border border-line-soft">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-rose-500/15 flex items-center justify-center">
                    <ArrowLeftRight size={16} className="text-rose-600" />
                  </div>
                  <h3 className="text-base font-semibold text-ink font-serif">反义词</h3>
                </div>
                <p className="text-charcoal leading-relaxed text-sm">{data.fanyi}</p>
              </div>
            )}
          </div>

          {/* Verification & English Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {hasDetail(data.yinzheng) && (
              <div className="bg-white rounded-2xl p-6 shadow-card border border-line-soft">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-amber/15 flex items-center justify-center">
                    <Stamp size={16} className="text-amber-deep" />
                  </div>
                  <h3 className="text-base font-semibold text-ink font-serif">印证</h3>
                </div>
                <p className="text-charcoal leading-relaxed text-sm">{data.yinzheng}</p>
              </div>
            )}
            {hasDetail(data.en) && (
              <div className="bg-white rounded-2xl p-6 shadow-card border border-line-soft">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/15 flex items-center justify-center">
                    <AlignLeft size={16} className="text-sky-600" />
                  </div>
                  <h3 className="text-base font-semibold text-ink font-serif">英文翻译</h3>
                </div>
                <p className="text-charcoal leading-relaxed text-sm italic">{data.en}</p>
              </div>
            )}
          </div>

          {/* Action Bar */}
          <div className="flex justify-center pt-4 pb-2">
            <ActionButton
              onClick={fetchIdiom}
              loading={loading}
              variant="primary"
              size="md"
              icon={<RefreshCw size={15} className={loading ? 'animate-spin' : ''} />}
            >
              换一个成语
            </ActionButton>
          </div>

          {/* Cultural Note */}
          <div className="bg-white rounded-2xl p-6 shadow-card border border-line-soft">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <BookMarked size={18} className="text-amber-deep" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-ink mb-2 font-serif">关于成语</h3>
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
