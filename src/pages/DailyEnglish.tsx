import { useState } from 'react';
import { RefreshCw, Volume2, BookOpen } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import type { DailyWordData } from '../types';
import LoadingCard from '../components/LoadingCard';
import ChatPanel from '../components/ChatPanel';

export default function DailyEnglish() {
  const [, setRefreshKey] = useState(0);
  const { data, loading, error, refetch } = useApi<DailyWordData>(
    'https://v2.xxapi.cn/api/randomenglishwords',
    { immediate: true }
  );

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    refetch();
  };

  const speakWord = (word: string) => {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  const getMainMeaning = (wordData: DailyWordData) => {
    if (wordData.translations && wordData.translations.length > 0) {
      return wordData.translations.map(t => `${t.pos} ${t.tran_cn}`).join('; ');
    }
    return '暂无释义';
  };

  const getFirstExample = (wordData: DailyWordData) => {
    if (wordData.sentences && wordData.sentences.length > 0) {
      return wordData.sentences[0];
    }
    return null;
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-amber/20 flex items-center justify-center">
            <BookOpen size={20} className="text-amber" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-ink font-serif">每日英语</h1>
            <p className="text-sm text-muted">每天学习一个新单词，积跬步以至千里</p>
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

      {data && (
        <div className="space-y-6">
          {/* Word Card */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-4xl font-bold text-ink font-serif mb-2">
                  {data.word || 'Word'}
                </h2>
                {(data.usphone || data.ukphone) && (
                  <div className="flex items-center gap-2 text-muted">
                    {data.usphone && <span className="text-lg">美 /{data.usphone}/</span>}
                    {data.ukphone && <span className="text-lg">英 /{data.ukphone}/</span>}
                    <button
                      onClick={() => speakWord(data.word || '')}
                      className="p-1.5 rounded-full hover:bg-amber/20 transition-colors"
                      title="播放发音"
                    >
                      <Volume2 size={16} className="text-amber" />
                    </button>
                  </div>
                )}
              </div>
              <button
                onClick={handleRefresh}
                className="flex items-center gap-2 px-4 py-2 bg-ivory text-ink rounded-lg hover:bg-amber/20 transition-colors text-sm"
              >
                <RefreshCw size={16} />
                <span>换一词</span>
              </button>
            </div>

            {/* Meaning */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-muted mb-2 uppercase tracking-wider">释义</h3>
              <p className="text-lg text-charcoal leading-relaxed">{getMainMeaning(data)}</p>
            </div>

            {/* Example */}
            {getFirstExample(data) && (
              <div className="bg-ivory rounded-xl p-5 border border-gray-100">
                <h3 className="text-sm font-medium text-muted mb-2 uppercase tracking-wider">例句</h3>
                <p className="text-charcoal italic leading-relaxed mb-2">
                  {getFirstExample(data)?.s_content}
                </p>
                <p className="text-muted text-sm">
                  {getFirstExample(data)?.s_cn}
                </p>
              </div>
            )}
          </div>

          {/* Related Words */}
          {data.relWords && data.relWords.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-medium text-ink mb-4 font-serif">相关词汇</h3>
              <div className="space-y-3">
                {data.relWords.map((rel, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-ivory rounded-xl">
                    <span className="px-2 py-0.5 bg-amber text-ink text-xs font-bold rounded-md flex-shrink-0">
                      {rel.Pos}
                    </span>
                    <div className="space-y-1">
                      {rel.Hwds.map((hw, i) => (
                        <div key={i} className="text-sm">
                          <span className="font-medium text-ink">{hw.hwd}</span>
                          <span className="text-muted"> {hw.tran}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Synonyms */}
          {data.synonyms && data.synonyms.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-medium text-ink mb-4 font-serif">同义词</h3>
              <div className="space-y-3">
                {data.synonyms.map((syn, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-ivory rounded-xl">
                    <span className="px-2 py-0.5 bg-ink/10 text-ink text-xs font-bold rounded-md flex-shrink-0">
                      {syn.pos}
                    </span>
                    <div>
                      <div className="flex flex-wrap gap-2 mb-1">
                        {syn.Hwds.map((hw, i) => (
                          <span key={i} className="text-sm font-medium text-ink">{hw.word}</span>
                        ))}
                      </div>
                      <p className="text-sm text-muted">{syn.tran}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* More Examples */}
          {data.sentences && data.sentences.length > 1 && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-medium text-ink mb-4 font-serif">更多例句</h3>
              <ul className="space-y-4">
                {data.sentences.slice(1).map((sent, index) => (
                  <li key={index} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                    <p className="text-charcoal italic mb-1">{sent.s_content}</p>
                    <p className="text-sm text-muted">{sent.s_cn}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <ChatPanel section="daily-english" currentData={data} />
    </div>
  );
}
