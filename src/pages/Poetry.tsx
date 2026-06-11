import { useState, useCallback, useEffect } from 'react';
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
import { PageHeader, ErrorState, EmptyState, SearchInput, ActionButton, SectionTitle } from '../components/UI';

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

  useEffect(() => {
    requestAnimationFrame(() => fetchPoetry('李白', 1));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentPoemForChat = selectedPoem || (data?.data && data.data[0]) || null;

  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader
        icon={ScrollText}
        title="古诗文大全"
        description="穿越千年，品味中华诗词之美"
        accent="amber"
      />

      {/* Search Area */}
      <div className="bg-white rounded-2xl p-6 shadow-card border border-line-soft mb-8">
        <div className="flex gap-3">
          <div className="flex-1">
            <SearchInput
              value={searchInput}
              onChange={setSearchInput}
              onSubmit={handleSearch}
              placeholder="搜索诗人、诗名、诗句或标签，如：李白、春江花月夜..."
              icon={Search}
              size="lg"
            />
          </div>
          <ActionButton
            onClick={handleSearch}
            disabled={loading || !searchInput.trim()}
            loading={loading}
            variant="primary"
            size="lg"
            icon={<Search size={15} />}
          >
            {loading ? '搜索中' : '搜索'}
          </ActionButton>
        </div>

        {/* Hot Searches */}
        <div className="mt-4 flex flex-wrap items-center gap-2 px-1">
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
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all duration-200 active:scale-95 ${
                  query === item.label
                    ? 'bg-gradient-to-br from-amber to-amber-deep text-ink shadow-sm'
                    : 'bg-amber/8 text-muted hover:bg-amber/15 hover:text-amber-deep'
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
      {error && !loading && (
        <div className="mb-6">
          <ErrorState message={error} onRetry={() => fetchPoetry(query, page)} />
        </div>
      )}

      {/* Results */}
      {data && data.data && (
        <div className="space-y-6 stagger-children">
          {/* Results Header */}
          <SectionTitle
            icon={Feather}
            title={`"${query}" 的搜索结果`}
            accent="amber"
            count={`第 ${data.page} 页`}
          >
            <span className="text-xs text-muted/60">
              共 {data.data.length} 首
            </span>
          </SectionTitle>

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
            <div className="bg-white rounded-2xl border border-line-soft shadow-card">
              <EmptyState
                icon={BookOpen}
                title="未找到相关诗文"
                description="请尝试其他关键词或更换搜索词"
              />
            </div>
          )}

          {/* Pagination */}
          {data.data.length > 0 && (
            <div className="flex items-center justify-center gap-3 pt-4">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page <= 1 || loading}
                className="flex items-center gap-1 px-4 py-2 rounded-xl bg-white border border-line text-sm text-charcoal hover:bg-amber/5 hover:border-amber/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 active:scale-95 shadow-sm"
              >
                <ChevronLeft size={16} />
                上一页
              </button>
              <span className="text-sm text-charcoal px-4 py-2 bg-white rounded-xl border border-line-soft min-w-[90px] text-center font-medium shadow-sm">
                第 {page} 页
              </span>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={data.data.length < 5 || page >= 50 || loading}
                className="flex items-center gap-1 px-4 py-2 rounded-xl bg-white border border-line text-sm text-charcoal hover:bg-amber/5 hover:border-amber/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 active:scale-95 shadow-sm"
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
      className={`bg-white rounded-2xl p-6 shadow-card border transition-all duration-300 cursor-pointer group active:scale-[0.99] ${
        isSelected
          ? 'border-amber/40 ring-2 ring-amber/15 shadow-card-hover'
          : 'border-line-soft hover:border-amber/30 hover:shadow-card-hover'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Title & Meta */}
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <h3 className="text-lg font-bold text-ink font-serif group-hover:text-amber-deep transition-colors">
              {poem.name}
            </h3>
            <span className="inline-flex items-center gap-1 text-xs text-amber-deep bg-amber/10 px-2 py-1 rounded-md font-medium">
              <User size={11} />
              {poem.author}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-muted bg-ivory px-2 py-1 rounded-md border border-line-soft">
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
          <div className="w-10 h-10 rounded-xl bg-amber/10 flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-amber group-hover:to-amber-deep group-hover:text-white text-amber-deep transition-all duration-300">
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
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 md:p-10 overflow-y-auto animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-3xl my-auto overflow-hidden animate-fade-in-up">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-xl bg-white/80 backdrop-blur text-muted hover:text-ink hover:bg-ivory transition-all active:scale-95"
        >
          <X size={20} />
        </button>

        <div className="max-h-[85vh] overflow-y-auto scrollbar-thin">
          {/* Hero Section */}
          <div className="relative bg-gradient-to-br from-ink via-ink-light to-ink-deep text-white px-8 pt-10 pb-8">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber/10 rounded-full -translate-y-1/2 translate-x-1/4 blur-2xl" />
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
                  <ScrollText size={16} className="text-amber-deep" />
                </div>
                <h3 className="text-base font-semibold text-ink font-serif">原文</h3>
              </div>
              <div className="bg-ivory rounded-2xl p-6 sm:p-8 border border-amber/10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-amber/30 via-amber/15 to-transparent" />
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
          <Icon size={16} className="text-amber-deep" />
        </div>
        <h3 className="text-base font-semibold text-ink font-serif">{title}</h3>
      </div>
      <div className="bg-white rounded-2xl p-6 border border-line-soft shadow-sm">
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
