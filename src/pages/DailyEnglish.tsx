import { useState, useRef } from 'react';
import { RefreshCw, BookOpen, Play, Pause, Volume2, Sparkles, Tag } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import type { DailyWordData } from '../types';
import LoadingCard from '../components/LoadingCard';
import ChatPanel from '../components/ChatPanel';
import { PageHeader, SectionTitle, ErrorState, OrnamentDivider } from '../components/UI';

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
    <div>
      <PageHeader
        icon={BookOpen}
        title="每日英语"
        description="每天学习一个新单词，积跬步以至千里"
        accent="amber"
      >
        <button
          onClick={handleRefresh}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-line text-ink rounded-xl hover:border-amber/40 hover:bg-amber/5 transition-all duration-200 text-sm font-medium shadow-sm active:scale-95"
        >
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          换一词
        </button>
      </PageHeader>

      {/* Content */}
      {loading && <LoadingCard />}

      {error && <ErrorState message={error} onRetry={refetch} />}

      {data && (
        <div className="space-y-5 stagger-children">
          {/* Word Header Card */}
          <div className="relative bg-white rounded-2xl p-8 md:p-10 shadow-card border border-line-soft overflow-hidden corner-accent group/card">
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber/5 rounded-full -translate-y-1/2 translate-x-1/4 group-hover/card:bg-amber/8 transition-colors duration-700" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-ink/5 rounded-full translate-y-1/2 -translate-x-1/4 group-hover/card:bg-ink/8 transition-colors duration-700" />

            <div className="relative">
              <div className="inline-flex items-center gap-1.5 mb-3 px-2.5 py-1 bg-amber/10 text-amber-deep rounded-md text-xs font-medium">
                <Sparkles size={11} />
                Today's Word
              </div>
              <h2 className="text-5xl md:text-6xl font-bold text-ink font-serif mb-5 tracking-tight">
                {data.word || 'Word'}
              </h2>

              {/* Phonetics */}
              <div className="flex flex-wrap items-center gap-3">
                {data.usphone && (
                  <div className="flex items-center gap-2.5 bg-ivory px-4 py-2.5 rounded-xl border border-amber/10">
                    <span className="text-[10px] font-bold text-amber-deep bg-amber/15 px-2 py-0.5 rounded-md">US</span>
                    <span className="text-charcoal font-mono text-sm">/{data.usphone}/</span>
                    {data.usspeech && (
                      <button
                        onClick={() => playAudio(data.usspeech!, 'us')}
                        className="p-1.5 rounded-full hover:bg-amber/20 transition-colors text-amber-deep"
                        title="播放美式发音"
                      >
                        {playingType === 'us' ? <Pause size={14} /> : <Play size={14} />}
                      </button>
                    )}
                  </div>
                )}
                {data.ukphone && (
                  <div className="flex items-center gap-2.5 bg-ivory px-4 py-2.5 rounded-xl border border-amber/10">
                    <span className="text-[10px] font-bold text-amber-deep bg-amber/15 px-2 py-0.5 rounded-md">UK</span>
                    <span className="text-charcoal font-mono text-sm">/{data.ukphone}/</span>
                    {data.ukspeech && (
                      <button
                        onClick={() => playAudio(data.ukspeech!, 'uk')}
                        className="p-1.5 rounded-full hover:bg-amber/20 transition-colors text-amber-deep"
                        title="播放英式发音"
                      >
                        {playingType === 'uk' ? <Pause size={14} /> : <Play size={14} />}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Translations */}
          {data.translations && data.translations.length > 0 && (
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-card border border-line-soft">
              <SectionTitle icon={Tag} title="释义" accent="amber" count={data.translations.length} />
              <div className="space-y-2.5">
                {data.translations.map((t, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 bg-ivory rounded-xl border border-amber/8 hover:border-amber/20 transition-colors"
                  >
                    <span className="px-2.5 py-1 bg-gradient-to-br from-amber to-amber-deep text-ink text-xs font-bold rounded-md flex-shrink-0 shadow-sm">
                      {t.pos}
                    </span>
                    <p className="text-charcoal text-[15px] leading-relaxed flex-1">{t.tran_cn}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Phrases */}
          {data.phrases && data.phrases.length > 0 && (
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-card border border-line-soft">
              <SectionTitle icon={Volume2} title="常用短语" accent="amber" count={data.phrases.length} />
              <div className="space-y-2.5">
                {data.phrases.map((phrase, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-ivory rounded-xl border border-amber/8">
                    <span className="w-7 h-7 rounded-full bg-amber/15 text-amber-deep flex items-center justify-center flex-shrink-0 text-xs font-bold">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-ink text-base">{phrase.p_content}</p>
                      <p className="text-muted text-sm mt-1 leading-relaxed">{phrase.p_cn}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sentences */}
          {data.sentences && data.sentences.length > 0 && (
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-card border border-line-soft">
              <SectionTitle icon={BookOpen} title="例句" accent="amber" count={data.sentences.length} />
              <div className="space-y-4">
                {data.sentences.map((sent, index) => (
                  <div
                    key={index}
                    className="relative pl-11 pb-4 last:pb-0 border-b border-line-soft last:border-0"
                  >
                    <span className="absolute left-0 top-0 w-7 h-7 rounded-full bg-gradient-to-br from-ink to-ink-light text-white flex items-center justify-center text-xs font-bold shadow-sm">
                      {index + 1}
                    </span>
                    <p className="text-charcoal italic leading-relaxed text-base font-serif">
                      {sent.s_content}
                    </p>
                    <p className="text-muted text-sm mt-2 leading-relaxed">{sent.s_cn}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Synonyms */}
          {data.synonyms && data.synonyms.length > 0 && (
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-card border border-line-soft">
              <SectionTitle icon={Sparkles} title="同义词" accent="emerald" count={data.synonyms.length} />
              <div className="space-y-2.5">
                {data.synonyms.map((syn, index) => (
                  <div key={index} className="p-4 bg-ivory rounded-xl border border-amber/8">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2.5 py-1 bg-ink/8 text-ink text-xs font-bold rounded-md">
                        {syn.pos}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {syn.Hwds.map((hw, i) => (
                        <span
                          key={i}
                          className="px-3 py-1.5 bg-white text-ink text-sm font-medium rounded-lg border border-emerald-500/15 hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-colors"
                        >
                          {hw.word}
                        </span>
                      ))}
                    </div>
                    <p className="text-sm text-muted leading-relaxed">{syn.tran}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related Words */}
          {data.relWords && data.relWords.length > 0 && (
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-card border border-line-soft">
              <SectionTitle icon={Tag} title="相关词汇" accent="purple" count={data.relWords.length} />
              <div className="space-y-2.5">
                {data.relWords.map((rel, index) => (
                  <div key={index} className="p-4 bg-ivory rounded-xl border border-amber/8">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2.5 py-1 bg-amber/15 text-amber-deep text-xs font-bold rounded-md">
                        {rel.Pos}
                      </span>
                    </div>
                    <div className="space-y-1.5">
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

          <OrnamentDivider />
        </div>
      )}

      <ChatPanel section="daily-english" currentData={data} />
    </div>
  );
}
