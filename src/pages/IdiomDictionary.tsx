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
  Eraser,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import type { IdiomData } from '../types';
import ChatPanel from '../components/ChatPanel';
import { PageHeader, ErrorState, EmptyState, SearchInput, ActionButton } from '../components/UI';

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
      <PageHeader
        icon={BookMarked}
        title="成语字典"
        description="探寻中华成语的博大精深，溯源辨流"
        accent="amber"
      />

      {/* Search Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-card border border-line-soft mb-6">
        <div className="flex gap-3">
          <div className="flex-1">
            <SearchInput
              value={query}
              onChange={setQuery}
              onSubmit={handleSearch}
              placeholder="输入成语，如：天马行空"
              icon={Search}
              size="md"
            />
          </div>
          <ActionButton
            onClick={handleSearch}
            disabled={loading || !query.trim()}
            loading={loading}
            variant="primary"
            size="md"
            icon={<Search size={15} />}
          >
            {loading ? '查询中' : '查询'}
          </ActionButton>
        </div>

        {/* History */}
        {history.length > 0 && (
          <div className="mt-4 pt-4 border-t border-line-soft">
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
                className="flex items-center gap-1 text-xs text-muted/50 hover:text-rose-500 transition-colors"
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
                    className={`px-3 py-1.5 rounded-lg text-xs transition-all duration-200 border ${
                      data?.words === item.words
                        ? 'bg-amber/15 border-amber/30 text-amber-deep font-medium'
                        : 'bg-ivory border-line-soft text-muted hover:border-amber/30 hover:text-ink'
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
        <div className="mb-6">
          <ErrorState message={error} onRetry={handleSearch} />
        </div>
      )}

      {/* Loading */}
      {loading && !data && (
        <div className="bg-white rounded-2xl p-8 shadow-card border border-line-soft animate-fade-in">
          <div className="space-y-4">
            <div className="h-8 w-1/2 rounded-md skeleton" />
            <div className="h-4 w-1/3 rounded-md skeleton" />
            <div className="h-24 w-full rounded-md skeleton mt-6" />
            <div className="h-24 w-full rounded-md skeleton" />
          </div>
        </div>
      )}

      {/* Result */}
      {data && (
        <div className="space-y-5 stagger-children">
          {/* Main Card */}
          <div className="relative bg-white rounded-2xl p-8 md:p-10 shadow-card border border-line-soft overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-36 h-36 bg-ink/5 rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="relative">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <span className="px-2.5 py-0.5 bg-amber/15 text-amber-deep text-xs rounded-md font-medium">
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
                      <div className="w-6 h-6 rounded-md bg-amber/15 flex items-center justify-center">
                        <Languages size={12} className="text-amber-deep" />
                      </div>
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
              icon={<Lightbulb size={16} className="text-amber-deep" />}
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
              icon={<MapPin size={16} className="text-ink" />}
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
                icon={<GitCompare size={16} className="text-emerald-600" />}
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
                      className="px-3 py-1.5 bg-emerald-500/10 text-emerald-700 rounded-lg text-sm hover:bg-emerald-500/20 transition-colors border border-emerald-500/15"
                    >
                      {word}
                    </button>
                  ))}
                </div>
              </InfoCard>
            )}

            {data.fanyi && (
              <InfoCard
                icon={<GitCompare size={16} className="text-rose-500" />}
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
                      className="px-3 py-1.5 bg-rose-500/10 text-rose-700 rounded-lg text-sm hover:bg-rose-500/20 transition-colors border border-rose-500/15"
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
              icon={<Sparkles size={16} className="text-sky-600" />}
              title="语法"
              color="sky"
            >
              <p className="text-charcoal leading-relaxed text-[15px]">{data.yufa.trim()}</p>
            </InfoCard>
          )}

          {/* Example Sentences */}
          {data.liju && (
            <InfoCard
              icon={<Quote size={16} className="text-purple-600" />}
              title="例句"
              color="purple"
            >
              <p className="text-charcoal leading-relaxed text-[15px]">{data.liju.trim()}</p>
            </InfoCard>
          )}

          {/* Citation */}
          {data.yinzheng && (
            <InfoCard
              icon={<ScrollText size={16} className="text-amber-deep" />}
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
        <div className="bg-white rounded-2xl border border-line-soft shadow-card">
          <EmptyState
            icon={BookMarked}
            title="开始查询成语"
            description="输入成语后点击查询，即可获取释义、出处、同反义词等详细信息"
          />
          <div className="flex flex-wrap justify-center gap-2 pb-8 -mt-2">
            {['画蛇添足', '守株待兔', '卧薪尝胆', '破釜沉舟'].map((word) => (
              <button
                key={word}
                onClick={() => {
                  setQuery(word);
                  fetchIdiom(word);
                }}
                className="px-4 py-2 bg-white border border-line-soft rounded-xl text-sm text-muted hover:border-amber/30 hover:text-ink hover:shadow-sm transition-all duration-200 active:scale-95"
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
    amber: { bg: 'bg-amber/15', text: 'text-amber-deep' },
    ink: { bg: 'bg-ink/10', text: 'text-ink' },
    emerald: { bg: 'bg-emerald-500/15', text: 'text-emerald-600' },
    rose: { bg: 'bg-rose-500/15', text: 'text-rose-500' },
    sky: { bg: 'bg-sky-500/15', text: 'text-sky-600' },
    purple: { bg: 'bg-purple-500/15', text: 'text-purple-600' },
  };

  const c = colorMap[color];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-card border border-line-soft">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-lg ${c.bg} flex items-center justify-center`}>
            {icon}
          </div>
          <h3 className="text-base font-semibold text-ink font-serif">{title}</h3>
        </div>
        {collapsible && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg hover:bg-ivory text-muted transition-colors"
          >
            {collapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </button>
        )}
      </div>
      {!collapsed && <div className="pl-0.5">{children}</div>}
    </div>
  );
}
