import { useState, useCallback } from 'react';
import { Swords, Search, MapPin, User, Calendar, BookOpen, Shield, Sparkles } from 'lucide-react';
import type { SanguoPersonData } from '../types';
import LoadingCard from '../components/LoadingCard';
import ChatPanel from '../components/ChatPanel';

const API_URL = 'https://cn.apihz.cn/api/zici/sanguo.php?id=10017576&key=1356a3698c81abe43c2eacb627cb6c91';

const HOT_HEROES = ['关羽', '刘备', '张飞', '诸葛亮', '曹操', '孙权', '赵云', '吕布', '周瑜', '司马懿'];

function getGuoColor(guo: string): { bg: string; text: string; border: string; icon: string } {
  if (guo.includes('蜀')) {
    return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: 'text-emerald-600' };
  }
  if (guo.includes('魏')) {
    return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: 'text-blue-600' };
  }
  if (guo.includes('吴')) {
    return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', icon: 'text-red-600' };
  }
  if (guo.includes('汉') || guo.includes('晋') || guo.includes('董') || guo.includes('黄')) {
    return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: 'text-amber-600' };
  }
  return { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200', icon: 'text-gray-500' };
}

function getAvatarColor(guo: string): string {
  if (guo.includes('蜀')) return 'bg-emerald-100 text-emerald-800 ring-emerald-200';
  if (guo.includes('魏')) return 'bg-blue-100 text-blue-800 ring-blue-200';
  if (guo.includes('吴')) return 'bg-red-100 text-red-800 ring-red-200';
  if (guo.includes('汉') || guo.includes('晋') || guo.includes('董') || guo.includes('黄')) return 'bg-amber-100 text-amber-800 ring-amber-200';
  return 'bg-gray-100 text-gray-800 ring-gray-200';
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

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        handleSearch();
      }
    },
    [handleSearch]
  );

  const guoStyle = data ? getGuoColor(data.guo) : null;
  const avatarStyle = data ? getAvatarColor(data.guo) : '';

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-amber/20 flex items-center justify-center">
            <Swords size={20} className="text-amber" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-ink font-serif">三国人物志</h1>
            <p className="text-sm text-muted">煮酒论英雄，探寻三国风云人物生平</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex items-center gap-3 bg-[#FAF8F5] rounded-xl px-4 py-3 border border-amber/10 focus-within:border-amber/40 focus-within:ring-2 focus-within:ring-amber/15 transition-all duration-300">
          <Search size={18} className="text-muted/60 flex-shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入三国人物姓名，如：关羽、曹操、诸葛亮..."
            className="flex-1 bg-transparent outline-none text-sm text-charcoal placeholder:text-muted/50"
          />
          <button
            onClick={handleSearch}
            disabled={loading || !query.trim()}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 active:scale-95 ${
              query.trim() && !loading
                ? 'bg-ink text-white hover:bg-ink/90 shadow-sm'
                : 'bg-gray-100 text-gray-300 cursor-not-allowed'
            }`}
          >
            {loading ? '查询中...' : '查询'}
          </button>
        </div>

        {/* Hot heroes */}
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-xs text-muted/60 flex items-center gap-1 mr-1">
            <Sparkles size={12} className="text-amber" />
            热门人物
          </span>
          {HOT_HEROES.map((hero) => (
            <button
              key={hero}
              onClick={() => {
                setQuery(hero);
                fetchHero(hero);
              }}
              className="px-3 py-1 text-xs rounded-full bg-amber/8 text-ink hover:bg-amber hover:text-white transition-all duration-200 border border-amber/15 hover:border-amber active:scale-95"
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
          <LoadingCard />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600 mb-3">{error}</p>
          <button
            onClick={() => fetchHero(query)}
            className="px-4 py-2 bg-ink text-white rounded-lg text-sm hover:bg-ink/90 transition-colors"
          >
            重新加载
          </button>
        </div>
      )}

      {/* Hero Profile */}
      {data && guoStyle && (
        <div className="space-y-6 animate-fade-in-up">
          {/* Overview Card */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
            <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
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
                <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
                  <h2 className="text-3xl font-bold text-ink font-serif text-center md:text-left">
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
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border bg-gray-50 text-gray-600 border-gray-200">
                      <BookOpen size={14} />
                      {data.real}
                    </span>
                  )}
                  {data.sex && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border bg-gray-50 text-gray-600 border-gray-200">
                      <User size={14} />
                      {data.sex}
                    </span>
                  )}
                </div>

                {/* Meta Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {data.age && (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-[#FAF8F5] border border-amber/8">
                      <div className="w-8 h-8 rounded-lg bg-amber/15 flex items-center justify-center flex-shrink-0">
                        <Calendar size={15} className="text-amber" />
                      </div>
                      <div>
                        <p className="text-[11px] text-muted/70 uppercase tracking-wide">生卒年</p>
                        <p className="text-sm font-medium text-ink font-serif">{data.age.trim()}</p>
                      </div>
                    </div>
                  )}
                  {data.py && (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-[#FAF8F5] border border-amber/8">
                      <div className="w-8 h-8 rounded-lg bg-amber/15 flex items-center justify-center flex-shrink-0">
                        <MapPin size={15} className="text-amber" />
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
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-lg bg-amber/15 flex items-center justify-center">
                  <BookOpen size={16} className="text-amber" />
                </div>
                <h3 className="text-lg font-bold text-ink font-serif">人物生平</h3>
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
        <div className="text-center py-16 animate-fade-in-up">
          <div className="w-20 h-20 rounded-3xl bg-amber/10 flex items-center justify-center mx-auto mb-5 border border-amber/15">
            <Swords size={36} className="text-amber/60" />
          </div>
          <h3 className="text-lg font-semibold text-ink font-serif mb-2">探索三国人物</h3>
          <p className="text-sm text-muted max-w-xs mx-auto leading-relaxed">
            在上方搜索框输入人物姓名，或点击热门标签，了解三国英雄的传奇一生
          </p>
        </div>
      )}

      <ChatPanel section="sanguo-heroes" currentData={data} />
    </div>
  );
}
