import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Quote, Lightbulb, BookMarked } from 'lucide-react';
import type { ProverbData } from '../types';
import LoadingCard from '../components/LoadingCard';
import ChatPanel from '../components/ChatPanel';
import { PageHeader, ErrorState, OrnamentDivider, ActionButton } from '../components/UI';

export default function Proverbs() {
  const [data, setData] = useState<ProverbData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProverb = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        'https://cn.apihz.cn/api/zici/yanyu.php?id=10017576&key=1356a3698c81abe43c2eacb627cb6c91',
        { headers: { Accept: 'application/json' } }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      if (result.code !== 200 && result.code !== '200') {
        throw new Error(result.msg || 'API返回错误');
      }
      // 该接口直接返回 saying/content，不包装在 data 字段中
      setData({ saying: result.saying, content: result.content });
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知错误');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProverb();
  }, [fetchProverb]);

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        icon={BookMarked}
        title="随机谚语"
        description="品味中华传统智慧，感悟人生哲理"
        accent="amber"
      >
        <ActionButton
          onClick={fetchProverb}
          loading={loading}
          variant="secondary"
          size="md"
          icon={<RefreshCw size={15} className={loading ? 'animate-spin' : ''} />}
        >
          换一条
        </ActionButton>
      </PageHeader>

      {/* Content */}
      {loading && !data && <LoadingCard />}

      {error && !data && <ErrorState message={error} onRetry={fetchProverb} />}

      {data && (
        <div key={data.saying} className="space-y-5 stagger-children">
          {/* Main Proverb Card */}
          <div className="relative bg-white rounded-2xl p-8 md:p-12 shadow-card border border-line-soft overflow-hidden corner-accent group/card">
            {/* Decorative Background Pattern */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover/card:bg-amber/8 transition-colors duration-700" />
            <div className="absolute bottom-0 left-0 w-36 h-36 bg-ink/5 rounded-full translate-y-1/2 -translate-x-1/4 group-hover/card:bg-ink/8 transition-colors duration-700" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-amber/[0.02] rounded-full blur-2xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-1000" />

            <div className="relative">
              {/* Top Quote Icon */}
              <div className="flex justify-center mb-6">
                <div className="relative group/icon">
                  <div className="absolute inset-0 bg-amber/30 rounded-full blur-xl scale-150 group-hover/icon:bg-amber/40 group-hover/icon:scale-[1.8] transition-all duration-700" />
                  <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-amber/20 to-amber/5 flex items-center justify-center border border-amber/20 group-hover/icon:border-amber/40 group-hover/icon:shadow-glow-amber transition-all duration-500">
                    <Quote size={28} className="text-amber-deep group-hover/icon:scale-110 transition-transform duration-500" />
                  </div>
                </div>
              </div>

              {/* Proverb Text */}
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-ink font-serif leading-relaxed tracking-wide">
                  {data.saying}
                </h2>
              </div>

              {/* Divider */}
              <OrnamentDivider className="my-6" />

              {/* Meaning Card */}
              <div className="bg-ivory rounded-xl p-6 md:p-8 border border-amber/8 hover:border-amber/15 hover:bg-white transition-all duration-500 group/meaning">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-amber/15 flex items-center justify-center group-hover/meaning:bg-amber/25 transition-colors duration-300">
                    <Lightbulb size={16} className="text-amber-deep" />
                  </div>
                  <h3 className="text-base font-semibold text-ink font-serif">寓意解读</h3>
                </div>
                <p className="text-charcoal text-lg leading-relaxed">
                  {data.content}
                </p>
              </div>

              {/* Action Bar */}
              <div className="flex justify-center mt-8">
                <ActionButton
                  onClick={fetchProverb}
                  loading={loading}
                  variant="primary"
                  size="md"
                  icon={<RefreshCw size={15} className={loading ? 'animate-spin' : ''} />}
                >
                  换一条谚语
                </ActionButton>
              </div>
            </div>
          </div>

          {/* Cultural Note */}
          <div className="bg-white rounded-2xl p-6 shadow-card border border-line-soft">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <BookMarked size={18} className="text-amber-deep" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-ink mb-2 font-serif">关于谚语</h3>
                <p className="text-muted text-sm leading-relaxed">
                  谚语是民间集体创造、广为流传、言简意赅并较为定性的艺术语句，是民众的丰富智慧和普遍经验的规律性总结。
                  中华谚语博大精深，蕴含着千百年来劳动人民的生活经验和人生智慧。
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <ChatPanel section="proverbs" currentData={data} />
    </div>
  );
}
