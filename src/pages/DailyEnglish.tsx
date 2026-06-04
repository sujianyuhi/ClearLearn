import { useState, useRef } from 'react';
import { RefreshCw, BookOpen, Play, Pause } from 'lucide-react';
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

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playingType, setPlayingType] = useState<'us' | 'uk' | null>(null);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    if (audioRef.current) {
      audioRef.current.pause();
      setPlayingType(null);
    }
    refetch();
  };

  const playAudio = (url: string, type: 'us' | 'uk') => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    const audio = new Audio(url);
    audioRef.current = audio;
    setPlayingType(type);
    audio.play().catch(() => {
      setPlayingType(null);
    });
    audio.onended = () => setPlayingType(null);
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
          {/* Word Header Card */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h2 className="text-5xl font-bold text-ink font-serif mb-4">
                  {data.word || 'Word'}
                </h2>

                {/* Phonetics */}
                <div className="flex flex-wrap items-center gap-4">
                  {data.usphone && (
                    <div className="flex items-center gap-2 bg-ivory px-4 py-2 rounded-lg">
                      <span className="text-xs font-bold text-amber">US</span>
                      <span className="text-charcoal">/{data.usphone}/</span>
                      {data.usspeech && (
                        <button
                          onClick={() => playAudio(data.usspeech!, 'us')}
                          className="p-1 rounded-full hover:bg-amber/20 transition-colors"
                          title="播放美式发音"
                        >
                          {playingType === 'us' ? (
                            <Pause size={14} className="text-amber" />
                          ) : (
                            <Play size={14} className="text-amber" />
                          )}
                        </button>
                      )}
                    </div>
                  )}
                  {data.ukphone && (
                    <div className="flex items-center gap-2 bg-ivory px-4 py-2 rounded-lg">
                      <span className="text-xs font-bold text-amber">UK</span>
                      <span className="text-charcoal">/{data.ukphone}/</span>
                      {data.ukspeech && (
                        <button
                          onClick={() => playAudio(data.ukspeech!, 'uk')}
                          className="p-1 rounded-full hover:bg-amber/20 transition-colors"
                          title="播放英式发音"
                        >
                          {playingType === 'uk' ? (
                            <Pause size={14} className="text-amber" />
                          ) : (
                            <Play size={14} className="text-amber" />
                          )}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={handleRefresh}
                className="flex items-center gap-2 px-4 py-2 bg-ivory text-ink rounded-lg hover:bg-amber/20 transition-colors text-sm"
              >
                <RefreshCw size={16} />
                <span>换一词</span>
              </button>
            </div>
          </div>

          {/* Translations */}
          {data.translations && data.translations.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-medium text-ink mb-4 font-serif flex items-center gap-2">
                <span className="w-1 h-5 bg-amber rounded-full"></span>
                释义
              </h3>
              <div className="space-y-3">
                {data.translations.map((t, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-ivory rounded-xl">
                    <span className="px-2.5 py-1 bg-amber text-ink text-xs font-bold rounded-md flex-shrink-0">
                      {t.pos}
                    </span>
                    <p className="text-charcoal text-lg leading-relaxed">{t.tran_cn}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Phrases */}
          {data.phrases && data.phrases.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-medium text-ink mb-4 font-serif flex items-center gap-2">
                <span className="w-1 h-5 bg-amber rounded-full"></span>
                常用短语
              </h3>
              <div className="space-y-3">
                {data.phrases.map((phrase, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-ivory rounded-xl">
                    <span className="w-7 h-7 rounded-full bg-amber/20 flex items-center justify-center flex-shrink-0 text-xs font-bold text-amber">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-ink text-base">{phrase.p_content}</p>
                      <p className="text-muted text-sm mt-1">{phrase.p_cn}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sentences */}
          {data.sentences && data.sentences.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-medium text-ink mb-4 font-serif flex items-center gap-2">
                <span className="w-1 h-5 bg-amber rounded-full"></span>
                例句
              </h3>
              <div className="space-y-4">
                {data.sentences.map((sent, index) => (
                  <div key={index} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                    <div className="flex items-start gap-3">
                      <span className="w-7 h-7 rounded-full bg-ink/10 flex items-center justify-center flex-shrink-0 text-xs font-bold text-ink mt-0.5">
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <p className="text-charcoal italic leading-relaxed text-base">{sent.s_content}</p>
                        <p className="text-muted text-sm mt-2">{sent.s_cn}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Synonyms */}
          {data.synonyms && data.synonyms.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-medium text-ink mb-4 font-serif flex items-center gap-2">
                <span className="w-1 h-5 bg-amber rounded-full"></span>
                同义词
              </h3>
              <div className="space-y-3">
                {data.synonyms.map((syn, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-ivory rounded-xl">
                    <span className="px-2.5 py-1 bg-ink/10 text-ink text-xs font-bold rounded-md flex-shrink-0">
                      {syn.pos}
                    </span>
                    <div className="flex-1">
                      <div className="flex flex-wrap gap-2 mb-2">
                        {syn.Hwds.map((hw, i) => (
                          <span key={i} className="px-3 py-1 bg-white text-ink text-sm font-medium rounded-lg border border-gray-100">
                            {hw.word}
                          </span>
                        ))}
                      </div>
                      <p className="text-sm text-muted">{syn.tran}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related Words */}
          {data.relWords && data.relWords.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-medium text-ink mb-4 font-serif flex items-center gap-2">
                <span className="w-1 h-5 bg-amber rounded-full"></span>
                相关词汇
              </h3>
              <div className="space-y-3">
                {data.relWords.map((rel, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-ivory rounded-xl">
                    <span className="px-2.5 py-1 bg-amber text-ink text-xs font-bold rounded-md flex-shrink-0">
                      {rel.Pos}
                    </span>
                    <div className="space-y-2">
                      {rel.Hwds.map((hw, i) => (
                        <div key={i} className="text-sm">
                          <span className="font-medium text-ink text-base">{hw.hwd}</span>
                          <span className="text-muted"> — {hw.tran}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      <ChatPanel section="daily-english" currentData={data} />
    </div>
  );
}
