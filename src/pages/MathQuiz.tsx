import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Calculator, CheckCircle, Lightbulb, BookOpen, BrainCircuit } from 'lucide-react';
import type { MathQuestionData } from '../types';
import LoadingCard from '../components/LoadingCard';
import ChatPanel from '../components/ChatPanel';

export default function MathQuiz() {
  const [data, setData] = useState<MathQuestionData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);

  const fetchQuestion = useCallback(async () => {
    setLoading(true);
    setError(null);
    setShowAnswer(false);
    setShowAnalysis(false);
    try {
      const response = await fetch(
        'https://cn.apihz.cn/api/zici/shuxuex.php?id=10017576&key=1356a3698c81abe43c2eacb627cb6c91',
        { headers: { Accept: 'application/json' } }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      if (result.code !== 200 && result.code !== '200') {
        throw new Error(result.msg || 'API返回错误');
      }
      setData({
        code: result.code,
        timu: result.timu,
        daan: result.daan,
        jiexi: result.jiexi,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知错误');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchQuestion();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchQuestion]);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-emerald/20 flex items-center justify-center">
            <Calculator size={20} className="text-emerald" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-ink font-serif">小学数学挑战</h1>
            <p className="text-sm text-muted">每日一题，锻炼思维，快乐学数学</p>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading && !data && <LoadingCard />}

      {error && !data && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600 mb-3">{error}</p>
          <button
            onClick={fetchQuestion}
            className="px-4 py-2 bg-ink text-white rounded-lg text-sm hover:bg-ink/90 transition-colors"
          >
            重新加载
          </button>
        </div>
      )}

      {data && (
        <div key={data.timu} className="space-y-6 animate-fade-in-up">
          {/* Question Card */}
          <div className="relative bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-gray-100 overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber/5 rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="relative">
              {/* Top Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-emerald/10 flex items-center justify-center shadow-sm">
                  <BrainCircuit size={32} className="text-emerald" />
                </div>
              </div>

              {/* Question Label */}
              <div className="flex justify-center mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald/10 text-emerald text-xs font-medium">
                  <BookOpen size={12} />
                  应用题
                </span>
              </div>

              {/* Question Text */}
              <div className="text-center mb-10">
                <h2 className="text-xl md:text-2xl font-bold text-ink leading-relaxed tracking-wide">
                  {data.timu}
                </h2>
              </div>

              {/* Divider */}
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="h-px w-12 bg-emerald/20" />
                <div className="w-2 h-2 rounded-full bg-emerald/40" />
                <div className="h-px w-12 bg-emerald/20" />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                <button
                  onClick={() => setShowAnswer(!showAnswer)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 active:scale-95 ${
                    showAnswer
                      ? 'bg-emerald text-white shadow-md'
                      : 'bg-emerald/10 text-emerald hover:bg-emerald/20'
                  }`}
                >
                  <CheckCircle size={16} />
                  {showAnswer ? '隐藏答案' : '查看答案'}
                </button>
                <button
                  onClick={() => setShowAnalysis(!showAnalysis)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 active:scale-95 ${
                    showAnalysis
                      ? 'bg-amber text-white shadow-md'
                      : 'bg-amber/10 text-amber hover:bg-amber/20'
                  }`}
                >
                  <Lightbulb size={16} />
                  {showAnalysis ? '收起解析' : '查看解析'}
                </button>
              </div>

              {/* Answer Section */}
              {showAnswer && (
                <div className="animate-fade-in-up mb-6">
                  <div className="bg-emerald/5 border border-emerald/15 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle size={18} className="text-emerald" />
                      <h3 className="text-base font-medium text-ink font-serif">正确答案</h3>
                    </div>
                    <p className="text-charcoal text-lg leading-relaxed font-medium">
                      {data.daan}
                    </p>
                  </div>
                </div>
              )}

              {/* Analysis Section */}
              {showAnalysis && (
                <div className="animate-fade-in-up">
                  <div className="bg-amber/5 border border-amber/15 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Lightbulb size={18} className="text-amber" />
                      <h3 className="text-base font-medium text-ink font-serif">解题思路</h3>
                    </div>
                    <div className="text-charcoal leading-relaxed whitespace-pre-line">
                      {data.jiexi}
                    </div>
                  </div>
                </div>
              )}

              {/* Next Question Button */}
              <div className="flex justify-center mt-8">
                <button
                  onClick={fetchQuestion}
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-3 bg-ink text-white rounded-xl hover:bg-ink/90 transition-all duration-200 text-sm shadow-md hover:shadow-lg active:scale-95 disabled:opacity-60"
                >
                  <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                  <span>再来一题</span>
                </button>
              </div>
            </div>
          </div>

          {/* Tips Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Calculator size={18} className="text-emerald" />
              </div>
              <div>
                <h3 className="text-base font-medium text-ink mb-2 font-serif">学习小贴士</h3>
                <p className="text-muted text-sm leading-relaxed">
                  小学数学应用题是培养逻辑思维的重要方式。解题时建议先仔细阅读题目，
                  找出已知条件和所求问题，再选择合适的运算方法。
                  遇到难题可以先尝试画图辅助理解，或者向 AI 助手请教解题思路。
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <ChatPanel section="math-quiz" currentData={data} />
    </div>
  );
}
