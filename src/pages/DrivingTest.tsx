import { useState } from 'react';
import { Car, CheckCircle2, XCircle, RefreshCw, Lightbulb } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import type { DrivingQuestionData } from '../types';
import LoadingCard from '../components/LoadingCard';
import ChatPanel from '../components/ChatPanel';

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
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-amber/20 flex items-center justify-center">
            <Car size={20} className="text-amber" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-ink font-serif">驾考练习</h1>
            <p className="text-sm text-muted">科目一/四模拟题，助你轻松通过理论考试</p>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading && <LoadingCard />}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600 mb-3">{error}</p>
          <button
            onClick={refetch}
            className="px-4 py-2 bg-ink text-white rounded-lg text-sm hover:bg-ink/90 transition-colors"
          >
            重新加载
          </button>
        </div>
      )}

      {data && isQuestionMode(data) && (
        <div className="space-y-6">
          {/* Question Card */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            {/* Question Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-ink/10 text-ink text-xs font-medium rounded-full">
                  {data.type || '科目一'}
                </span>
                {data.chapter && (
                  <span className="px-3 py-1 bg-amber/10 text-amber text-xs font-medium rounded-full">
                    {data.chapter}
                  </span>
                )}
              </div>
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-4 py-2 bg-ivory text-ink rounded-lg hover:bg-amber/20 transition-colors text-sm"
              >
                <RefreshCw size={16} />
                <span>下一题</span>
              </button>
            </div>

            {/* Question Image */}
            {data.pic && (
              <div className="mb-6">
                <img
                  src={data.pic}
                  alt="题目图片"
                  className="max-w-full h-auto rounded-xl border border-gray-100"
                  style={{ maxHeight: '300px' }}
                />
              </div>
            )}

            {/* Question */}
            <h2 className="text-xl font-medium text-charcoal mb-6 leading-relaxed">
              {data.question}
            </h2>

            {/* Options */}
            <div className="space-y-3">
              {getOptions(data).map((option, index) => {
                const isSelected = selectedOption === index;
                const answerIndex = getAnswerIndex(data.answer);
                const isCorrect = index === answerIndex;
                const showResult = showAnswer;

                let buttonClass = 'w-full text-left px-5 py-4 rounded-xl border-2 transition-all duration-200 ';

                if (showResult) {
                  if (isCorrect) {
                    buttonClass += 'border-green-500 bg-green-50 text-green-800';
                  } else if (isSelected && !isCorrect) {
                    buttonClass += 'border-red-400 bg-red-50 text-red-700';
                  } else {
                    buttonClass += 'border-gray-100 bg-white text-charcoal opacity-60';
                  }
                } else {
                  buttonClass += 'border-gray-100 bg-white text-charcoal hover:border-amber hover:bg-amber/5 cursor-pointer';
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleSelect(index)}
                    disabled={showAnswer}
                    className={buttonClass}
                  >
                    <div className="flex items-center gap-4">
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                        showResult
                          ? isCorrect
                            ? 'bg-green-500 text-white'
                            : isSelected
                            ? 'bg-red-400 text-white'
                            : 'bg-gray-100 text-gray-400'
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
                      <span className="flex-1">{option.replace(/^[A-D]、\s*/, '')}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Result */}
            {showAnswer && (
              <div className={`mt-6 p-5 rounded-xl ${
                selectedOption === getAnswerIndex(data.answer)
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  {selectedOption === getAnswerIndex(data.answer) ? (
                    <CheckCircle2 size={20} className="text-green-600" />
                  ) : (
                    <XCircle size={20} className="text-red-500" />
                  )}
                  <span className={`font-medium ${
                    selectedOption === getAnswerIndex(data.answer) ? 'text-green-700' : 'text-red-600'
                  }`}>
                    {selectedOption === getAnswerIndex(data.answer) ? '回答正确！' : '回答错误'}
                  </span>
                </div>
                <p className="text-sm text-charcoal">
                  正确答案：<span className="font-bold text-green-700">{data.answer}</span>
                </p>
              </div>
            )}
          </div>

          {/* Explanation */}
          {showAnswer && data.explain && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb size={18} className="text-amber" />
                <h3 className="text-lg font-medium text-ink font-serif">题目解析</h3>
              </div>
              <p className="text-charcoal leading-relaxed">{data.explain}</p>
            </div>
          )}
        </div>
      )}

      {data && !isQuestionMode(data) && (
        <div className="space-y-6">
          {/* Knowledge Card */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-amber/10 text-amber text-xs font-medium rounded-full">
                  知识点
                </span>
                {data.chapter && (
                  <span className="px-3 py-1 bg-ink/10 text-ink text-xs font-medium rounded-full">
                    {data.chapter}
                  </span>
                )}
              </div>
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-4 py-2 bg-ivory text-ink rounded-lg hover:bg-amber/20 transition-colors text-sm"
              >
                <RefreshCw size={16} />
                <span>下一题</span>
              </button>
            </div>

            {/* Question Image */}
            {data.pic && (
              <div className="mb-6">
                <img
                  src={data.pic}
                  alt="题目图片"
                  className="max-w-full h-auto rounded-xl border border-gray-100"
                  style={{ maxHeight: '300px' }}
                />
              </div>
            )}

            <div className="bg-ivory rounded-xl p-6 border border-gray-100">
              <p className="text-lg text-charcoal leading-relaxed font-medium">
                {data.question || data.explain}
              </p>
            </div>

            {data.explain && data.question && (
              <div className="mt-4 p-4 rounded-xl bg-white border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb size={16} className="text-amber" />
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
