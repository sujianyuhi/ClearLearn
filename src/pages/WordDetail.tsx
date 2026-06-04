import { useState, useRef } from 'react';
import { Search, BookMarked, Play, Pause } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import type { WordDetailData } from '../types';
import LoadingCard from '../components/LoadingCard';
import ChatPanel from '../components/ChatPanel';

export default function WordDetail() {
  const [searchWord, setSearchWord] = useState('');
  const [queryWord, setQueryWord] = useState<string | null>(null);

  const { data, loading, error, refetch } = useApi<WordDetailData>(
    queryWord ? `https://v2.xxapi.cn/api/englishwords?word=${encodeURIComponent(queryWord)}` : null,
    { immediate: true }
  );

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playingType, setPlayingType] = useState<'us' | 'uk' | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchWord.trim()) {
      setQueryWord(searchWord.trim());
    }
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

  const sampleWords = ['serendipity', 'ephemeral', 'resilience', 'eloquent', 'meticulous'];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-amber/20 flex items-center justify-center">
            <BookMarked size={20} className="text-amber" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-ink font-serif">单词详解</h1>
            <p className="text-sm text-muted">深入查询英语单词的详细释义和用法</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchWord}
              onChange={(e) => setSearchWord(e.target.value)}
              placeholder="输入要查询的英语单词..."
              className="w-full px-5 py-3.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber focus:border-transparent text-charcoal placeholder:text-muted"
            />
            <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted" />
          </div>
          <button
            type="submit"
            disabled={!searchWord.trim()}
            className={`px-6 py-3.5 rounded-xl font-medium transition-all ${
              searchWord.trim()
                ? 'bg-ink text-white hover:bg-ink/90'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            查询
          </button>
        </div>

        {/* Sample Words */}
        <div className="flex items-center gap-2 mt-4 flex-wrap">
          <span className="text-xs text-muted">试试这些词：</span>
          {sampleWords.map((word) => (
            <button
              key={word}
              onClick={() => {
                setSearchWord(word);
                setQueryWord(word);
              }}
              className="px-3 py-1 bg-ivory text-ink rounded-full text-xs hover:bg-amber/20 transition-colors"
            >
              {word}
            </button>
          ))}
        </div>
      </form>

      {/* Results */}
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
          {/* Word Header */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h2 className="text-5xl font-bold text-ink font-serif mb-4">
                  {data.word || queryWord}
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
            </div>

            {/* Meanings */}
            {data.translations && data.translations.length > 0 && (
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
            )}
          </div>

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

          {/* Examples */}
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

      {!data && !loading && !error && (
        <div className="text-center py-16">
          <div className="w-20 h-20 rounded-full bg-ivory flex items-center justify-center mx-auto mb-4">
            <Search size={32} className="text-muted" />
          </div>
          <h3 className="text-lg font-medium text-ink mb-2 font-serif">开始查询</h3>
          <p className="text-sm text-muted">输入英语单词，获取详细释义和用法</p>
        </div>
      )}

      <ChatPanel section="word-detail" currentData={data} />
    </div>
  );
}
