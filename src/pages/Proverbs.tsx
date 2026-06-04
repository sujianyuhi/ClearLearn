import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Quote, Lightbulb, BookMarked } from 'lucide-react';
import type { ProverbData } from '../types';
import LoadingCard from '../components/LoadingCard';
import ChatPanel from '../components/ChatPanel';

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
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-amber/20 flex items-center justify-center">
            <BookMarked size={20} className="text-amber" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-ink font-serif">随机谚语</h1>
            <p className="text-sm text-muted">品味中华传统智慧，感悟人生哲理</p>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading && !data && <LoadingCard />}

      {error && !data && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600 mb-3">{error}</p>
          <button
            onClick={fetchProverb}
            className="px-4 py-2 bg-ink text-white rounded-lg text-sm hover:bg-ink/90 transition-colors"
          >
            重新加载
          </button>
        </div>
      )}

      {data && (
        <div key={data.saying} className="space-y-6 animate-fade-in-up">
          {/* Main Proverb Card */}
          <div className="relative bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-gray-100 overflow-hidden">
            {/* Decorative Background Pattern */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-amber/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-ink/5 rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="relative">
              {/* Top Quote Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-14 h-14 rounded-full bg-amber/15 flex items-center justify-center">
                  <Quote size={28} className="text-amber" />
                </div>
              </div>

              {/* Proverb Text */}
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-ink font-serif leading-relaxed tracking-wide">
                  {data.saying}
                </h2>
              </div>

              {/* Divider */}
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="h-px w-12 bg-amber/30" />
                <div className="w-2 h-2 rounded-full bg-amber/50" />
                <div className="h-px w-12 bg-amber/30" />
              </div>

              {/* Meaning Card */}
              <div className="bg-ivory rounded-xl p-6 md:p-8">
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb size={18} className="text-amber" />
                  <h3 className="text-base font-medium text-ink font-serif">寓意解读</h3>
                </div>
                <p className="text-charcoal text-lg leading-relaxed">
                  {data.content}
                </p>
              </div>

              {/* Action Bar */}
              <div className="flex justify-center mt-8">
                <button
                  onClick={fetchProverb}
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-3 bg-ink text-white rounded-xl hover:bg-ink/90 transition-all duration-200 text-sm shadow-md hover:shadow-lg active:scale-95 disabled:opacity-60"
                >
                  <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                  <span>换一条谚语</span>
                </button>
              </div>
            </div>
          </div>

          {/* Cultural Note */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <BookMarked size={18} className="text-amber" />
              </div>
              <div>
                <h3 className="text-base font-medium text-ink mb-2 font-serif">关于谚语</h3>
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
