import { useState, useCallback } from 'react';
import { Swords, Search, MapPin, User, Calendar, BookOpen, Shield, Sparkles } from 'lucide-react';
import type { SanguoPersonData } from '../types';
import LoadingCard from '../components/LoadingCard';
import ChatPanel from '../components/ChatPanel';
import { PageHeader, ErrorState, EmptyState, SearchInput, ActionButton } from '../components/UI';

const API_URL = 'https://cn.apihz.cn/api/zici/sanguo.php?id=10017576&key=1356a3698c81abe43c2eacb627cb6c91';

const HOT_HEROES = ['关羽', '刘备', '张飞', '诸葛亮', '曹操', '孙权', '赵云', '吕布', '周瑜', '司马懿'];

function getGuoColor(guo: string): { bg: string; text: string; border: string; icon: string; ring: string; accent: 'emerald' | 'sky' | 'rose' | 'amber' | 'ink' } {
  if (guo.includes('蜀')) {
    return { bg: 'bg-emerald-500/10', text: 'text-emerald-700', border: 'border-emerald-500/15', icon: 'text-emerald-600', ring: 'ring-emerald-500/15', accent: 'emerald' };
  }
  if (guo.includes('魏')) {
    return { bg: 'bg-sky-500/10', text: 'text-sky-700', border: 'border-sky-500/15', icon: 'text-sky-600', ring: 'ring-sky-500/15', accent: 'sky' };
  }
  if (guo.includes('吴')) {
    return { bg: 'bg-rose-500/10', text: 'text-rose-700', border: 'border-rose-500/15', icon: 'text-rose-600', ring: 'ring-rose-500/15', accent: 'rose' };
  }
  if (guo.includes('汉') || guo.includes('晋') || guo.includes('董') || guo.includes('黄')) {
    return { bg: 'bg-amber/10', text: 'text-amber-deep', border: 'border-amber/15', icon: 'text-amber-deep', ring: 'ring-amber/15', accent: 'amber' };
  }
  return { bg: 'bg-ink/8', text: 'text-ink', border: 'border-ink/10', icon: 'text-ink', ring: 'ring-ink/10', accent: 'ink' };
}

function getAvatarColor(guo: string): string {
  if (guo.includes('蜀')) return 'bg-emerald-500/10 text-emerald-700 ring-emerald-500/20';
  if (guo.includes('魏')) return 'bg-sky-500/10 text-sky-700 ring-sky-500/20';
  if (guo.includes('吴')) return 'bg-rose-500/10 text-rose-700 ring-rose-500/20';
  if (guo.includes('汉') || guo.includes('晋') || guo.includes('董') || guo.includes('黄')) return 'bg-amber/10 text-amber-deep ring-amber/20';
  return 'bg-ink/8 text-ink ring-ink/15';
}

export default function SanguoHeroes() {
  const [query, setQuery] = useState('');
  const [data, setData] = useState<SanguoPersonData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHero = useCallback(async (name: string) => {
    if (!name.trim()) return;
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await fetch(`${API_URL}&words=${encodeURIComponent(name.trim())}`, {
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.code !== 200 && result.code !== '200') {
        throw new Error(result.msg || 'API返回错误');
      }

      const datas = result.datas as SanguoPersonData[] | undefined;
      if (!datas || datas.length === 0) {
        throw new Error('未找到该人物信息，请尝试其他名字');
      }

      setData(datas[0]);
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知错误');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = useCallback(() => {
    fetchHero(query);
  }, [fetchHero, query]);

  const guoStyle = data ? getGuoColor(data.guo) : null;
  const avatarStyle = data ? getAvatarColor(data.guo) : '';

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        icon={Swords}
        title="三国人物志"
        description="煮酒论英雄，探寻三国风云人物生平"
        accent="amber"
      />

      {/* Search */}
      <div className="bg-white rounded-2xl p-6 shadow-card border border-line-soft mb-6">
        <div className="flex gap-3">
          <div className="flex-1">
            <SearchInput
              value={query}
              onChange={setQuery}
              onSubmit={handleSearch}
              placeholder="输入三国人物姓名，如：关羽、曹操、诸葛亮..."
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
            查询
          </ActionButton>
        </div>

        {/* Hot heroes */}
        <div className="mt-4 flex flex-wrap items-center gap-2 px-1">
          <span className="text-xs text-muted/60 flex items-center gap-1 mr-1">
            <Sparkles size={12} className="text-amber-deep" />
            热门人物
          </span>
          {HOT_HEROES.map((hero) => (
            <button
              key={hero}
              onClick={() => {
                setQuery(hero);
                fetchHero(hero);
              }}
              className="px-3 py-1 text-xs rounded-full bg-amber/8 text-ink hover:bg-gradient-to-br hover:from-amber hover:to-amber-deep hover:text-white transition-all duration-200 border border-amber/15 hover:border-amber active:scale-95"
            >
              {hero}
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="space-y-4">
          <LoadingCard />
        </div>
      )}

      {/* Error */}
      {error && <ErrorState message={error} onRetry={() => fetchHero(query)} />}

      {/* Hero Profile */}
      {data && guoStyle && (
        <div className="space-y-5 stagger-children">
          {/* Overview Card */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-card border border-line-soft relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-40 h-40 ${guoStyle.bg} rounded-full -translate-y-1/2 translate-x-1/2 opacity-50`} />

            <div className="relative flex flex-col md:flex-row gap-6 md:gap-8 items-start">
              {/* Avatar */}
              <div className="flex-shrink-0 mx-auto md:mx-0">
                <div
                  className={`w-28 h-28 md:w-32 md:h-32 rounded-full flex items-center justify-center text-5xl font-serif font-bold ring-4 ring-offset-4 ring-offset-white ${avatarStyle} shadow-lg`}
                >
                  {data.name.charAt(0)}
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 w-full">
                <div className="flex flex-col md:flex-row md:items-baseline gap-3 mb-4">
                  <h2 className="text-3xl font-bold text-ink font-serif text-center md:text-left tracking-wide">
                    {data.name}
                  </h2>
                  {data.zi && (
                    <span className="text-lg text-muted font-serif text-center md:text-left">
                      {data.zi}
                    </span>
                  )}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-5">
                  {data.guo && (
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border ${guoStyle.bg} ${guoStyle.text} ${guoStyle.border}`}
                    >
                      <Shield size={14} className={guoStyle.icon} />
                      {data.guo.replace('主效：', '')}
                    </span>
                  )}
                  {data.real && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border bg-ivory text-muted border-line-soft">
                      <BookOpen size={14} />
                      {data.real}
                    </span>
                  )}
                  {data.sex && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border bg-ivory text-muted border-line-soft">
                      <User size={14} />
                      {data.sex}
                    </span>
                  )}
                </div>

                {/* Meta Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {data.age && (
                    <div className="flex items-center gap-3 p-3.5 rounded-xl bg-ivory border border-amber/8">
                      <div className="w-9 h-9 rounded-lg bg-amber/15 flex items-center justify-center flex-shrink-0">
                        <Calendar size={15} className="text-amber-deep" />
                      </div>
                      <div>
                        <p className="text-[11px] text-muted/70 uppercase tracking-wide">生卒年</p>
                        <p className="text-sm font-medium text-ink font-serif">{data.age.trim()}</p>
                      </div>
                    </div>
                  )}
                  {data.py && (
                    <div className="flex items-center gap-3 p-3.5 rounded-xl bg-ivory border border-amber/8">
                      <div className="w-9 h-9 rounded-lg bg-amber/15 flex items-center justify-center flex-shrink-0">
                        <MapPin size={15} className="text-amber-deep" />
                      </div>
                      <div>
                        <p className="text-[11px] text-muted/70 uppercase tracking-wide">拼音</p>
                        <p className="text-sm font-medium text-ink">{data.py}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Biography */}
          {data.content && (
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-card border border-line-soft">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-8 h-8 rounded-lg bg-amber/15 flex items-center justify-center">
                  <BookOpen size={16} className="text-amber-deep" />
                </div>
                <h3 className="text-base font-semibold text-ink font-serif">人物生平</h3>
              </div>

              <div className="relative">
                {/* Decorative quote line */}
                <div className="absolute left-0 top-0 bottom-0 w-1 rounded-full bg-gradient-to-b from-amber via-amber/60 to-amber/20" />

                <div className="pl-6">
                  <p className="text-charcoal leading-[1.9] text-[15px] font-sans whitespace-pre-wrap">
                    {data.content}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && !data && (
        <div className="bg-white rounded-2xl border border-line-soft shadow-card">
          <EmptyState
            icon={Swords}
            title="探索三国人物"
            description="在上方搜索框输入人物姓名，或点击热门标签，了解三国英雄的传奇一生"
          />
        </div>
      )}

      <ChatPanel section="sanguo-heroes" currentData={data} />
    </div>
  );
}
