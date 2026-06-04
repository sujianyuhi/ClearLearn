import { useState, useCallback, useEffect, useRef } from 'react';
import {
  Search,
  ScrollText,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  User,
  Clock,
  Tag,
  Sparkles,
  X,
  Feather,
  Scroll,
  Eye,
} from 'lucide-react';
import type { PoetryData, PoetryItem } from '../types';
import LoadingCard from '../components/LoadingCard';
import ChatPanel from '../components/ChatPanel';

const API_BASE = 'https://cn.apihz.cn/api/zici/poetry.php?id=10017576&key=1356a3698c81abe43c2eacb627cb6c91';


const HOT_SEARCHES = [
  { label: '李白', icon: User },
  { label: '杜甫', icon: User },
  { label: '苏轼', icon: User },
  { label: '唐诗三百首', icon: BookOpen },
  { label: '小学', icon: Scroll },
  { label: '春江花月夜', icon: Sparkles },
];

function formatContent(html: string): string[] {
  const div = document.createElement('div');
  div.innerHTML = html;
  return Array.from(div.querySelectorAll('p'))
    .map((p) => p.textContent?.trim())
    .filter((t): t is string => !!t);
}

export default function Poetry() {
  const [query, setQuery] = useState('李白');
  const [searchInput, setSearchInput] = useState('李白');
  const [page, setPage] = useState(1);
  const [data, setData] = useState<PoetryData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPoem, setSelectedPoem] = useState<PoetryItem | null>(null);

  const fetchPoetry = useCallback(async (words: string, p: number) => {
    if (!words.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_BASE}&words=${encodeURIComponent(words.trim())}&page=${p}`,
        { headers: { Accept: 'application/json' } }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      if (result.code !== 200 && result.code !== '200') {
        throw new Error(result.msg || 'API返回错误');
      }
      setData(result as PoetryData);
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知错误');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = useCallback(() => {
    if (!searchInput.trim()) return;
    setQuery(searchInput.trim());
    setPage(1);
    setSelectedPoem(null);
    fetchPoetry(searchInput.trim(), 1);
  }, [searchInput, fetchPoetry]);

  const handlePageChange = useCallback(
    (newPage: number) => {
      if (!query) return;
      setPage(newPage);
      fetchPoetry(query, newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [query, fetchPoetry]
  );

  const handleHotSearch = useCallback(
    (word: string) => {
      setSearchInput(word);
      setQuery(word);
      setPage(1);
      setSelectedPoem(null);
      fetchPoetry(word, 1);
    },
    [fetchPoetry]
  );

  const autoLoadRef = useRef(false);

  useEffect(() => {
    if (!autoLoadRef.current) {
      autoLoadRef.current = true;
      requestAnimationFrame(() => fetchPoetry('李白', 1));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentPoemForChat = selectedPoem || (data?.data && data.data[0]) || null;

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-amber/20 flex items-center justify-center">
            <ScrollText size={20} className="text-amber" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-ink font-serif">古诗文大全</h1>
            <p className="text-sm text-muted">穿越千年，品味中华诗词之美</p>
          </div>
        </div>
      </div>

      {/* Search Area */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted/50"
            />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="搜索诗人、诗名、诗句或标签，如：李白、春江花月夜..."
              className="w-full pl-11 pr-4 py-3.5 bg-[#FAF8F5] rounded-xl border border-amber/10 text-charcoal placeholder:text-muted/50 focus:outline-none focus:border-amber/40 focus:ring-2 focus:ring-amber/15 transition-all"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={loading || !searchInput.trim()}
            className="px-6 py-3.5 bg-ink text-white rounded-xl hover:bg-ink/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-md hover:shadow-lg active:scale-95"
          >
            {loading ? '搜索中...' : '搜索'}
          </button>
        </div>

        {/* Hot Searches */}
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-xs text-muted/60 flex items-center gap-1 mr-1">
            <Sparkles size={12} />
            热门搜索
          </span>
          {HOT_SEARCHES.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={() => handleHotSearch(item.label)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all active:scale-95 ${
                  query === item.label
                    ? 'bg-amber text-ink shadow-sm'
                    : 'bg-amber/8 text-muted hover:bg-amber/20 hover:text-ink'
                }`}
              >
                <Icon size={12} />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Loading */}
      {loading && !data && <LoadingCard />}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center mb-6">
          <p className="text-red-600 mb-3">{error}</p>
          <button
            onClick={() => fetchPoetry(query, page)}
            className="px-4 py-2 bg-ink text-white rounded-lg text-sm hover:bg-ink/90 transition-colors"
          >
            重新加载
          </button>
        </div>
      )}

      {/* Results */}
      {data && data.data && (
        <div className="space-y-6">
          {/* Results Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Feather size={16} className="text-amber" />
              <span className="text-sm text-muted">
                “{query}” 的搜索结果 · 第 {data.page} 页
              </span>
            </div>
            <span className="text-xs text-muted/50">
              共 {data.data.length} 首
            </span>
          </div>

          {/* Poetry List */}
          <div className="grid gap-5">
            {data.data.map((poem, index) => (
              <PoetryCard
                key={`${poem.name}-${poem.author}-${index}`}
                poem={poem}
                isSelected={selectedPoem?.name === poem.name && selectedPoem?.author === poem.author}
                onSelect={() => setSelectedPoem(poem)}
              />
            ))}
          </div>

          {/* Empty State */}
          {data.data.length === 0 && !loading && (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-amber/10 flex items-center justify-center mx-auto mb-4">
                <BookOpen size={28} className="text-amber/50" />
              </div>
              <p className="text-muted text-sm">未找到相关诗文，请尝试其他关键词</p>
            </div>
          )}

          {/* Pagination */}
          {data.data.length > 0 && (
            <div className="flex items-center justify-center gap-3 pt-4">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page <= 1 || loading}
                className="flex items-center gap-1 px-4 py-2 rounded-xl bg-white border border-gray-100 text-sm text-charcoal hover:bg-amber/5 hover:border-amber/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
              >
                <ChevronLeft size={16} />
                上一页
              </button>
              <span className="text-sm text-muted px-3 py-2 bg-white rounded-xl border border-gray-100 min-w-[80px] text-center">
                第 {page} 页
              </span>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={data.data.length < 5 || page >= 50 || loading}
                className="flex items-center gap-1 px-4 py-2 rounded-xl bg-white border border-gray-100 text-sm text-charcoal hover:bg-amber/5 hover:border-amber/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
              >
                下一页
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Detail Modal */}
      {selectedPoem && (
        <PoetryDetailModal
          poem={selectedPoem}
          onClose={() => setSelectedPoem(null)}
        />
      )}

      <ChatPanel section="poetry" currentData={currentPoemForChat} />
    </div>
  );
}

function PoetryCard({
  poem,
  isSelected,
  onSelect,
}: {
  poem: PoetryItem;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const lines = formatContent(poem.content);
  const preview = lines.slice(0, 2).join('，');
  const tags = poem.tag ? poem.tag.split(',').filter(Boolean) : [];

  return (
    <div
      onClick={onSelect}
      className={`bg-white rounded-2xl p-6 shadow-sm border transition-all cursor-pointer group active:scale-[0.99] ${
        isSelected
          ? 'border-amber/40 ring-2 ring-amber/10 shadow-md'
          : 'border-gray-100 hover:border-amber/25 hover:shadow-md'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Title & Meta */}
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <h3 className="text-lg font-bold text-ink font-serif group-hover:text-amber transition-colors">
              {poem.name}
            </h3>
            <span className="inline-flex items-center gap-1 text-xs text-muted bg-amber/8 px-2 py-1 rounded-md">
              <User size={11} />
              {poem.author}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-muted bg-ivory px-2 py-1 rounded-md border border-gray-100">
              <Clock size={11} />
              {poem.dynasty}
            </span>
          </div>

          {/* Preview */}
          <p className="text-charcoal/80 text-sm leading-relaxed font-serif mb-3 line-clamp-2">
            {preview}
            {lines.length > 2 && '...'}
          </p>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 text-[11px] text-amber-700 bg-amber/10 px-2 py-0.5 rounded-md"
                >
                  <Tag size={10} />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* View Button */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-xl bg-amber/10 flex items-center justify-center group-hover:bg-amber group-hover:text-white text-amber transition-all">
            <Eye size={18} />
          </div>
        </div>
      </div>
    </div>
  );
}

function PoetryDetailModal({ poem, onClose }: { poem: PoetryItem; onClose: () => void }) {
  const lines = formatContent(poem.content);
  const tags = poem.tag ? poem.tag.split(',').filter(Boolean) : [];

  // Lock body scroll when modal opens
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 md:p-10 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink/30 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-3xl my-auto overflow-hidden animate-fade-in-up">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-xl bg-white/80 backdrop-blur text-muted hover:text-ink hover:bg-gray-100 transition-all"
        >
          <X size={20} />
        </button>

        <div className="max-h-[85vh] overflow-y-auto scrollbar-thin">
          {/* Hero Section */}
          <div className="relative bg-gradient-to-br from-ink via-[#243D5F] to-[#2A4A73] text-white px-8 pt-10 pb-8">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber/10 rounded-full -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />

            <div className="relative">
              {/* Tags */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 text-[11px] bg-white/15 backdrop-blur px-2.5 py-1 rounded-md"
                    >
                      <Tag size={10} />
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Title */}
              <h2 className="text-2xl sm:text-3xl font-bold font-serif mb-3 tracking-wide">
                {poem.name}
              </h2>

              {/* Author Info */}
              <div className="flex items-center gap-4 text-sm text-white/70">
                <span className="inline-flex items-center gap-1.5">
                  <User size={14} />
                  {poem.author}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock size={14} />
                  {poem.dynasty}
                </span>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="px-8 py-8 space-y-8">
            {/* Original Poem */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-amber/15 flex items-center justify-center">
                  <ScrollText size={16} className="text-amber" />
                </div>
                <h3 className="text-base font-medium text-ink font-serif">原文</h3>
              </div>
              <div className="bg-[#FAF8F5] rounded-2xl p-6 sm:p-8 border border-amber/10">
                {lines.map((line, i) => (
                  <p
                    key={i}
                    className="text-lg sm:text-xl text-charcoal font-serif leading-loose text-center"
                  >
                    {line}
                  </p>
                ))}
              </div>
            </section>

            {/* Translation & Notes */}
            {(poem.ywjzsy || poem.ywjzse) && (
              <InfoSection
                icon={BookOpen}
                title="译文与注释"
                content={poem.ywjzsy || poem.ywjzse || ''}
              />
            )}

            {/* Creation Background */}
            {poem.czbj && (
              <InfoSection
                icon={Feather}
                title="创作背景"
                content={poem.czbj}
              />
            )}

            {/* Appreciation */}
            {(poem.sxy || poem.sxe) && (
              <InfoSection
                icon={Sparkles}
                title="赏析"
                content={poem.sxy || poem.sxe || ''}
              />
            )}

            {/* Writing Technique */}
            {poem.xzsf && (
              <InfoSection
                icon={Scroll}
                title="写作手法"
                content={poem.xzsf}
              />
            )}

            {/* Commentary */}
            {(poem.dj || poem.pj) && (
              <InfoSection
                icon={Eye}
                title="点评"
                content={poem.dj || poem.pj || ''}
              />
            )}

            {/* Classical Knowledge */}
            {poem.wyzs && (
              <InfoSection
                icon={BookOpen}
                title="文言知识"
                content={poem.wyzs}
              />
            )}

            {/* Introduction */}
            {poem.jj && (
              <InfoSection
                icon={ScrollText}
                title="简介"
                content={poem.jj}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoSection({
  icon: Icon,
  title,
  content,
}: {
  icon: React.ElementType;
  title: string;
  content: string;
}) {
  const hasHtml = content.includes('<');

  return (
    <section className="animate-fade-in-up">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-amber/15 flex items-center justify-center">
          <Icon size={16} className="text-amber" />
        </div>
        <h3 className="text-base font-medium text-ink font-serif">{title}</h3>
      </div>
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        {hasHtml ? (
          <div
            className="text-sm text-charcoal leading-relaxed poetry-html"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        ) : (
          <p className="text-sm text-charcoal leading-relaxed whitespace-pre-wrap">
            {content}
          </p>
        )}
      </div>
    </section>
  );
}
