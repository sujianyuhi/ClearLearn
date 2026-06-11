import { useState } from 'react';
import { Car, CheckCircle2, XCircle, RefreshCw, Lightbulb } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import type { DrivingQuestionData } from '../types';
import LoadingCard from '../components/LoadingCard';
import ChatPanel from '../components/ChatPanel';
import { PageHeader, ErrorState, ActionButton } from '../components/UI';

export default function DrivingTest() {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const { data, loading, error, refetch } = useApi<DrivingQuestionData>(
    'https://v2.xxapi.cn/api/jiakao?subject=1',
    { immediate: true }
  );

  const handleSelect = (index: number) => {
    if (showAnswer) return;
    setSelectedOption(index);
    setShowAnswer(true);
  };

  const handleNext = () => {
    setSelectedOption(null);
    setShowAnswer(false);
    refetch();
  };

  const getOptionLabel = (index: number) => {
    return ['A', 'B', 'C', 'D'][index] || String.fromCharCode(65 + index);
  };

  const getOptions = (questionData: DrivingQuestionData): string[] => {
    const options: string[] = [];
    if (questionData.option1) options.push(questionData.option1);
    if (questionData.option2) options.push(questionData.option2);
    if (questionData.option3) options.push(questionData.option3);
    if (questionData.option4) options.push(questionData.option4);
    return options;
  };

  const getAnswerIndex = (answer: string): number => {
    const label = answer?.toUpperCase().trim();
    return ['A', 'B', 'C', 'D'].indexOf(label);
  };

  const isQuestionMode = (d: DrivingQuestionData): boolean => {
    return getOptions(d).length > 0 && !!d.answer;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        icon={Car}
        title="驾考练习"
        description="科目一/四模拟题，助你轻松通过理论考试"
        accent="amber"
      >
        <ActionButton
          onClick={handleNext}
          loading={loading}
          variant="secondary"
          size="md"
          icon={<RefreshCw size={15} className={loading ? 'animate-spin' : ''} />}
        >
          下一题
        </ActionButton>
      </PageHeader>

      {/* Content */}
      {loading && <LoadingCard />}

      {error && <ErrorState message={error} onRetry={refetch} />}

      {data && isQuestionMode(data) && (
        <div className="space-y-5 stagger-children">
          {/* Question Card */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-card border border-line-soft">
            {/* Question Header */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 bg-ink/10 text-ink text-xs font-medium rounded-full">
                  {data.type || '科目一'}
                </span>
                {data.chapter && (
                  <span className="px-3 py-1 bg-amber/15 text-amber-deep text-xs font-medium rounded-full">
                    {data.chapter}
                  </span>
                )}
              </div>
            </div>

            {/* Question Image */}
            {data.pic && (
              <div className="mb-6">
                <img
                  src={data.pic}
                  alt="题目图片"
                  className="max-w-full h-auto rounded-xl border border-line-soft shadow-sm"
                  style={{ maxHeight: '300px' }}
                />
              </div>
            )}

            {/* Question */}
            <h2 className="text-xl font-semibold text-charcoal mb-6 leading-relaxed font-serif">
              {data.question}
            </h2>

            {/* Options */}
            <div className="space-y-2.5">
              {getOptions(data).map((option, index) => {
                const isSelected = selectedOption === index;
                const answerIndex = getAnswerIndex(data.answer);
                const isCorrect = index === answerIndex;
                const showResult = showAnswer;

                let buttonClass = 'w-full text-left px-5 py-4 rounded-xl border-2 transition-all duration-300 ';

                if (showResult) {
                  if (isCorrect) {
                    buttonClass += 'border-emerald-500 bg-emerald-500/8 text-emerald-800';
                  } else if (isSelected && !isCorrect) {
                    buttonClass += 'border-rose-500 bg-rose-500/8 text-rose-700';
                  } else {
                    buttonClass += 'border-line-soft bg-white text-charcoal opacity-60';
                  }
                } else {
                  buttonClass += 'border-line-soft bg-white text-charcoal hover:border-amber hover:bg-amber/5 cursor-pointer active:scale-[0.99]';
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleSelect(index)}
                    disabled={showAnswer}
                    className={buttonClass}
                  >
                    <div className="flex items-center gap-4">
                      <span className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 transition-all duration-200 ${
                        showResult
                          ? isCorrect
                            ? 'bg-emerald-500 text-white shadow-md'
                            : isSelected
                            ? 'bg-rose-500 text-white shadow-md'
                            : 'bg-ivory text-muted/50'
                          : 'bg-ivory text-ink'
                      }`}>
                        {showResult && isCorrect ? (
                          <CheckCircle2 size={16} />
                        ) : showResult && isSelected ? (
                          <XCircle size={16} />
                        ) : (
                          getOptionLabel(index)
                        )}
                      </span>
                      <span className="flex-1 leading-relaxed">{option.replace(/^[A-D]、\s*/, '')}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Result */}
            {showAnswer && (
              <div className={`mt-6 p-5 rounded-xl border ${
                selectedOption === getAnswerIndex(data.answer)
                  ? 'bg-emerald-500/8 border-emerald-500/20'
                  : 'bg-rose-500/8 border-rose-500/20'
              } animate-fade-in-up`}>
                <div className="flex items-center gap-2.5 mb-2">
                  {selectedOption === getAnswerIndex(data.answer) ? (
                    <CheckCircle2 size={20} className="text-emerald-600" />
                  ) : (
                    <XCircle size={20} className="text-rose-500" />
                  )}
                  <span className={`font-semibold ${
                    selectedOption === getAnswerIndex(data.answer) ? 'text-emerald-700' : 'text-rose-600'
                  }`}>
                    {selectedOption === getAnswerIndex(data.answer) ? '回答正确！' : '回答错误'}
                  </span>
                </div>
                <p className="text-sm text-charcoal">
                  正确答案：<span className="font-bold text-emerald-700 font-mono">{data.answer}</span>
                </p>
              </div>
            )}
          </div>

          {/* Explanation */}
          {showAnswer && data.explain && (
            <div className="bg-white rounded-2xl p-6 shadow-card border border-line-soft animate-fade-in-up">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-lg bg-amber/15 flex items-center justify-center">
                  <Lightbulb size={16} className="text-amber-deep" />
                </div>
                <h3 className="text-base font-semibold text-ink font-serif">题目解析</h3>
              </div>
              <p className="text-charcoal leading-relaxed">{data.explain}</p>
            </div>
          )}
        </div>
      )}

      {data && !isQuestionMode(data) && (
        <div className="space-y-5 stagger-children">
          {/* Knowledge Card */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-card border border-line-soft">
            <div className="flex items-center gap-2 mb-6 flex-wrap">
              <span className="px-3 py-1 bg-amber/15 text-amber-deep text-xs font-medium rounded-full">
                知识点
              </span>
              {data.chapter && (
                <span className="px-3 py-1 bg-ink/10 text-ink text-xs font-medium rounded-full">
                  {data.chapter}
                </span>
              )}
            </div>

            {/* Question Image */}
            {data.pic && (
              <div className="mb-6">
                <img
                  src={data.pic}
                  alt="题目图片"
                  className="max-w-full h-auto rounded-xl border border-line-soft shadow-sm"
                  style={{ maxHeight: '300px' }}
                />
              </div>
            )}

            <div className="bg-ivory rounded-xl p-6 border border-amber/10">
              <p className="text-lg text-charcoal leading-relaxed font-medium font-serif">
                {data.question || data.explain}
              </p>
            </div>

            {data.explain && data.question && (
              <div className="mt-4 p-4 rounded-xl bg-white border border-line-soft">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb size={16} className="text-amber-deep" />
                  <span className="text-sm font-medium text-ink">补充说明</span>
                </div>
                <p className="text-sm text-charcoal leading-relaxed">{data.explain}</p>
              </div>
            )}
          </div>
        </div>
      )}

      <ChatPanel section="driving-test" currentData={data} />
    </div>
  );
}
