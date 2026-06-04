import { useState, useCallback } from 'react';
import {
  Search,
  BookMarked,
  Lightbulb,
  MapPin,
  GitCompare,
  ScrollText,
  Languages,
  Quote,
  Sparkles,
  AlertCircle,
  Eraser,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import type { IdiomData } from '../types';
import ChatPanel from '../components/ChatPanel';

export default function IdiomDictionary() {
  const [query, setQuery] = useState('');
  const [data, setData] = useState<IdiomData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<IdiomData[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const fetchIdiom = useCallback(async (searchWord: string) => {
    if (!searchWord.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const encoded = encodeURIComponent(searchWord.trim());
      const response = await fetch(
        `https://cn.apihz.cn/api/zici/chacy.php?id=10017576&key=1356a3698c81abe43c2eacb627cb6c91&words=${encoded}`,
        { headers: { Accept: 'application/json' } }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      if (result.code !== 200 && result.code !== '200') {
        throw new Error(result.msg || '未找到该成语');
      }
      const idiom: IdiomData = result;
      setData(idiom);
      setHistory((prev) => {
        const filtered = prev.filter((i) => i.words !== idiom.words);
        return [idiom, ...filtered].slice(0, 10);
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : '查询失败');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = useCallback(() => {
    fetchIdiom(query);
  }, [fetchIdiom, query]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleSearch();
      }
    },
    [handleSearch]
  );

  const handleHistoryClick = useCallback(
    (item: IdiomData) => {
      setData(item);
      setQuery(item.words);
      setError(null);
    },
    []
  );

  const handleClearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-amber/20 flex items-center justify-center">
            <BookMarked size={20} className="text-amber" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-ink font-serif">成语字典</h1>
            <p className="text-sm text-muted">探寻中华成语的博大精深，溯源辨流</p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted/60"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="输入成语，如：天马行空"
              className="w-full pl-10 pr-4 py-3 bg-ivory rounded-xl text-sm text-ink placeholder:text-muted/50 outline-none border border-transparent focus:border-amber/40 focus:ring-2 focus:ring-amber/15 transition-all"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={loading || !query.trim()}
            className="px-6 py-3 bg-ink text-white rounded-xl text-sm font-medium hover:bg-ink/90 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 shadow-md hover:shadow-lg"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                查询中
              </span>
            ) : (
              '查询'
            )}
          </button>
        </div>

        {/* History */}
        {history.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-50">
            <div className="flex items-center justify-between mb-2">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="flex items-center gap-1.5 text-xs text-muted/70 hover:text-ink transition-colors"
              >
                <span>最近查询</span>
                {showHistory ? (
                  <ChevronUp size={12} />
                ) : (
                  <ChevronDown size={12} />
                )}
              </button>
              <button
                onClick={handleClearHistory}
                className="flex items-center gap-1 text-xs text-muted/50 hover:text-red-500 transition-colors"
              >
                <Eraser size={11} />
                清空
              </button>
            </div>
            {showHistory && (
              <div className="flex flex-wrap gap-2">
                {history.map((item) => (
                  <button
                    key={item.words}
                    onClick={() => handleHistoryClick(item)}
                    className={`px-3 py-1.5 rounded-lg text-xs transition-all border ${
                      data?.words === item.words
                        ? 'bg-amber/15 border-amber/30 text-amber-700 font-medium'
                        : 'bg-ivory border-gray-100 text-muted hover:border-amber/20 hover:text-ink'
                    }`}
                  >
                    {item.words}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center mb-6 animate-fade-in-up">
          <AlertCircle size={24} className="text-red-500 mx-auto mb-2" />
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Result */}
      {data && (
        <div className="space-y-5 animate-fade-in-up">
          {/* Main Card */}
          <div className="relative bg-white rounded-2xl p-8 md:p-10 shadow-sm border border-gray-100 overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-36 h-36 bg-ink/5 rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="relative">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2.5 py-0.5 bg-amber/10 text-amber-700 text-xs rounded-md font-medium">
                      成语
                    </span>
                    {data.bushou && (
                      <span className="px-2.5 py-0.5 bg-ink/8 text-ink/70 text-xs rounded-md">
                        部首：{data.bushou}
                      </span>
                    )}
                    {data.shouzi && (
                      <span className="px-2.5 py-0.5 bg-ink/8 text-ink/70 text-xs rounded-md">
                        首字：{data.shouzi}
                      </span>
                    )}
                  </div>

                  <h2 className="text-4xl md:text-5xl font-bold text-ink font-serif tracking-widest mb-3">
                    {data.words}
                  </h2>

                  {data.pinyin && (
                    <p className="text-lg text-muted font-mono tracking-wide">
                      {data.pinyin}
                    </p>
                  )}
                </div>

                {/* English Translation */}
                {data.en && (
                  <div className="md:w-64 lg:w-72 bg-ivory rounded-xl p-5 border border-amber/10">
                    <div className="flex items-center gap-2 mb-2">
                      <Languages size={15} className="text-amber" />
                      <span className="text-xs font-medium text-ink/70">英文释义</span>
                    </div>
                    <p className="text-sm text-charcoal leading-relaxed">{data.en}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Meaning */}
          {data.jieshi && (
            <InfoCard
              icon={<Lightbulb size={18} className="text-amber" />}
              title="释义"
              color="amber"
            >
              <p className="text-charcoal leading-relaxed text-[15px]">
                {data.jieshi.trim()}
              </p>
            </InfoCard>
          )}

          {/* Origin */}
          {data.chuchu && (
            <InfoCard
              icon={<MapPin size={18} className="text-ink" />}
              title="出处"
              color="ink"
            >
              <p className="text-charcoal leading-relaxed text-[15px]">{data.chuchu.trim()}</p>
            </InfoCard>
          )}

          {/* Synonyms & Antonyms */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {data.tongyi && (
              <InfoCard
                icon={<GitCompare size={18} className="text-emerald-600" />}
                title="同义词"
                color="emerald"
              >
                <div className="flex flex-wrap gap-2">
                  {data.tongyi.split(/[,，、]/).map((w) => w.trim()).filter(Boolean).map((word) => (
                    <button
                      key={word}
                      onClick={() => {
                        setQuery(word);
                        fetchIdiom(word);
                      }}
                      className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-sm hover:bg-emerald-100 transition-colors border border-emerald-100"
                    >
                      {word}
                    </button>
                  ))}
                </div>
              </InfoCard>
            )}

            {data.fanyi && (
              <InfoCard
                icon={<GitCompare size={18} className="text-rose-500" />}
                title="反义词"
                color="rose"
              >
                <div className="flex flex-wrap gap-2">
                  {data.fanyi.split(/[,，、]/).map((w) => w.trim()).filter(Boolean).map((word) => (
                    <button
                      key={word}
                      onClick={() => {
                        setQuery(word);
                        fetchIdiom(word);
                      }}
                      className="px-3 py-1.5 bg-rose-50 text-rose-700 rounded-lg text-sm hover:bg-rose-100 transition-colors border border-rose-100"
                    >
                      {word}
                    </button>
                  ))}
                </div>
              </InfoCard>
            )}
          </div>

          {/* Grammar */}
          {data.yufa && (
            <InfoCard
              icon={<Sparkles size={18} className="text-sky-600" />}
              title="语法"
              color="sky"
            >
              <p className="text-charcoal leading-relaxed text-[15px]">{data.yufa.trim()}</p>
            </InfoCard>
          )}

          {/* Example Sentences */}
          {data.liju && (
            <InfoCard
              icon={<Quote size={18} className="text-purple-500" />}
              title="例句"
              color="purple"
            >
              <p className="text-charcoal leading-relaxed text-[15px]">{data.liju.trim()}</p>
            </InfoCard>
          )}

          {/* Citation */}
          {data.yinzheng && (
            <InfoCard
              icon={<ScrollText size={18} className="text-amber" />}
              title="引证"
              color="amber"
              collapsible
              defaultCollapsed
            >
              <p className="text-charcoal/80 leading-relaxed text-sm whitespace-pre-line">
                {data.yinzheng.trim()}
              </p>
            </InfoCard>
          )}
        </div>
      )}

      {/* Empty State */}
      {!data && !error && !loading && (
        <div className="text-center py-20">
          <div className="w-20 h-20 rounded-3xl bg-amber/10 flex items-center justify-center mx-auto mb-5 border border-amber/15">
            <BookMarked size={36} className="text-amber/60" />
          </div>
          <h3 className="text-lg font-medium text-ink mb-1.5 font-serif">开始查询成语</h3>
          <p className="text-sm text-muted/70 max-w-xs mx-auto leading-relaxed">
            输入成语后点击查询，即可获取释义、出处、同反义词等详细信息
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {['画蛇添足', '守株待兔', '卧薪尝胆', '破釜沉舟'].map((word) => (
              <button
                key={word}
                onClick={() => {
                  setQuery(word);
                  fetchIdiom(word);
                }}
                className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-sm text-muted hover:border-amber/30 hover:text-ink transition-all shadow-sm hover:shadow-md"
              >
                {word}
              </button>
            ))}
          </div>
        </div>
      )}

      <ChatPanel section="idiom" currentData={data} />
    </div>
  );
}

/* ==================== Sub Components ==================== */

function InfoCard({
  icon,
  title,
  color,
  children,
  collapsible,
  defaultCollapsed,
}: {
  icon: React.ReactNode;
  title: string;
  color: 'amber' | 'ink' | 'emerald' | 'rose' | 'sky' | 'purple';
  children: React.ReactNode;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed ?? false);

  const colorMap = {
    amber: 'bg-amber/10 text-amber border-amber/15',
    ink: 'bg-ink/8 text-ink border-ink/10',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    rose: 'bg-rose-50 text-rose-700 border-rose-100',
    sky: 'bg-sky-50 text-sky-700 border-sky-100',
    purple: 'bg-purple-50 text-purple-700 border-purple-100',
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${colorMap[color].split(' ')[0]}`}>
            {icon}
          </div>
          <h3 className="text-base font-medium text-ink font-serif">{title}</h3>
        </div>
        {collapsible && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-muted transition-colors"
          >
            {collapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </button>
        )}
      </div>
      {!collapsed && <div className="pl-0.5">{children}</div>}
    </div>
  );
}
