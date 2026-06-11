import { useState, useCallback, useEffect, useRef } from 'react';
import {
  Search,
  Atom,
  Flame,
  Droplets,
  Mountain,
  Microscope,
  Leaf,
  User,
  Globe,
  Zap,
  Thermometer,
  Hash,
  Beaker,
  Sparkles,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';
import type { ElementData } from '../types';
import LoadingCard from '../components/LoadingCard';
import ChatPanel from '../components/ChatPanel';
import { PageHeader, ErrorState, SearchInput, ActionButton } from '../components/UI';

const API_BASE = 'https://cn.apihz.cn/api/other/yuansu.php?id=10017576&key=1356a3698c81abe43c2eacb627cb6c91';

const SUGGESTIONS = [
  { label: '氢', value: '氢', symbol: 'H', num: 1 },
  { label: '氧', value: '氧', symbol: 'O', num: 8 },
  { label: '铁', value: '铁', symbol: 'Fe', num: 26 },
  { label: '金', value: '金', symbol: 'Au', num: 79 },
  { label: '银', value: '银', symbol: 'Ag', num: 47 },
  { label: '碳', value: '碳', symbol: 'C', num: 6 },
  { label: '钠', value: '钠', symbol: 'Na', num: 11 },
  { label: '钙', value: '钙', symbol: 'Ca', num: 20 },
];

export default function ChemicalElement() {
  const [query, setQuery] = useState('氢');
  const [data, setData] = useState<ElementData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const initRef = useRef(false);

  const fetchElement = useCallback(async (name: string) => {
    if (!name.trim()) return;
    setLoading(true);
    setError(null);
    setSearched(true);
    try {
      const response = await fetch(`${API_BASE}&name=${encodeURIComponent(name.trim())}`, {
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      if (result.code !== 200 && result.code !== '200') {
        throw new Error(result.msg || '未找到该元素，请检查输入');
      }
      setData(result as ElementData);
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知错误');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = useCallback(() => {
    fetchElement(query);
  }, [fetchElement, query]);

  const handleSuggestionClick = useCallback(
    (value: string) => {
      setQuery(value);
      fetchElement(value);
    },
    [fetchElement]
  );

  // 默认加载氢元素
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;
    queueMicrotask(() => {
      fetchElement('1');
    });
  }, [fetchElement]);

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        icon={Atom}
        title="元素周期表"
        description="探索化学元素的奥秘，查询元素属性与知识"
        accent="ink"
      />

      {/* Search Section */}
      <div className="bg-white rounded-2xl p-6 shadow-card border border-line-soft mb-6">
        <div className="flex gap-3 mb-4">
          <div className="flex-1">
            <SearchInput
              value={query}
              onChange={setQuery}
              onSubmit={handleSearch}
              placeholder="输入元素名称、符号或原子序数，如：氢 / H / 1"
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
            icon={loading ? <RotateCcw size={15} className="animate-spin" /> : <Search size={15} />}
          >
            查询
          </ActionButton>
        </div>

        {/* Suggestions */}
        <div className="flex flex-wrap items-center gap-2 px-1">
          <span className="text-xs text-muted/60 mr-1 flex items-center gap-1">
            <Sparkles size={12} className="text-amber-deep" />
            热门元素
          </span>
          {SUGGESTIONS.map((item) => (
            <button
              key={item.value}
              onClick={() => handleSuggestionClick(item.value)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-ivory hover:bg-amber/10 border border-line-soft hover:border-amber/30 rounded-lg text-xs text-charcoal transition-all duration-200 active:scale-95"
            >
              <span className="font-bold text-ink font-mono">{item.symbol}</span>
              <span className="text-muted/70">{item.label}</span>
              <span className="text-[10px] text-muted/50">({item.num})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {loading && <LoadingCard />}

      {/* Error */}
      {error && searched && !loading && <ErrorState message={error} onRetry={() => fetchElement(query)} retryText="重试" />}

      {/* Element Content */}
      {data && !loading && (
        <div key={data.id} className="space-y-5 stagger-children">
          {/* Hero Card */}
          <div className="bg-white rounded-2xl shadow-card border border-line-soft overflow-hidden">
            <div className="flex flex-col md:flex-row">
              {/* Left: Big Element Tile */}
              <div className="md:w-56 bg-gradient-to-br from-ink via-ink-light to-ink-deep text-white p-8 flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-amber/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
                <div className="relative text-center">
                  <div className="text-sm text-white/60 mb-1 font-mono">{data.id}</div>
                  <div className="text-7xl font-bold tracking-tight mb-2 font-serif">{data.ysfh}</div>
                  <div className="text-lg font-serif">{data.zwmc}</div>
                  <div className="text-sm text-white/60 mt-1">{data.ywmc}</div>
                  {data.yht && (
                    <div className="mt-3 inline-block px-3 py-1 bg-amber/20 rounded-full text-xs text-amber border border-amber/30">
                      {getCategoryName(data.yht)}
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Key Info */}
              <div className="flex-1 p-6 md:p-8 bg-white">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <InfoItem icon={<Hash size={14} />} label="原子序数" value={data.id} />
                  <InfoItem icon={<Atom size={14} />} label="原子质量" value={data.yzzl} unit="u" />
                  <InfoItem icon={<Beaker size={14} />} label="电子构型" value={data.dzgx} mono />
                  <InfoItem icon={<Zap size={14} />} label="氧化态" value={data.yht || '--'} />
                  <InfoItem icon={<Mountain size={14} />} label="原子半径" value={data.yzbj} unit="Å" />
                  <InfoItem icon={<Microscope size={14} />} label="共价半径" value={data.gjbj} unit="Å" />
                </div>

                {data.dzmx && (
                  <div className="mt-5 pt-5 border-t border-line-soft">
                    <p className="text-xs text-muted/60 mb-2 flex items-center gap-1.5">
                      <Atom size={12} className="text-amber-deep" />
                      电子层模型
                    </p>
                    <img
                      src={data.dzmx}
                      alt={`${data.zwmc}电子模型`}
                      className="h-24 object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Properties Grid */}
          <div className="grid md:grid-cols-2 gap-5">
            {/* Physical Properties */}
            <div className="bg-white rounded-2xl p-6 shadow-card border border-line-soft">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-9 h-9 rounded-xl bg-amber/15 flex items-center justify-center">
                  <Thermometer size={17} className="text-amber-deep" />
                </div>
                <h3 className="text-base font-semibold text-ink font-serif">物理性质</h3>
              </div>
              <div className="space-y-3.5">
                <PropertyRow label="熔点" value={data.rd} unit="°C" />
                <PropertyRow label="沸点" value={data.fd} unit="°C" />
                <PropertyRow label="密度" value={data.md} unit="g/cm³" />
                <PropertyRow label="原子体积" value={data.yztj} unit="cm³/mol" />
                <PropertyRow label="热导率" value={data.rhr} unit="W/(cm·K)" />
                <PropertyRow label="电导率" value={data.drxs} />
                <PropertyRow label="状态" value={data.zt} fullWidth />
              </div>
            </div>

            {/* Chemical & Nature */}
            <div className="bg-white rounded-2xl p-6 shadow-card border border-line-soft">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-9 h-9 rounded-xl bg-ink/10 flex items-center justify-center">
                  <Flame size={17} className="text-ink" />
                </div>
                <h3 className="text-base font-semibold text-ink font-serif">化学与特性</h3>
              </div>
              <div className="space-y-3.5">
                <PropertyRow label="电子构型" value={data.dzgx} mono />
                <PropertyRow label="氧化态" value={data.yht} />
                <PropertyRow label="离子半径" value={data.lzbj} unit="Å" />
                <PropertyRow label="电离能" value={data.diq} unit="kJ/mol" />
                <PropertyRow label="电子亲和能" value={data.daq} />
                <PropertyRow label="电负性" value={data.ddl} />
                <PropertyRow label="特性描述" value={data.ty} fullWidth />
              </div>
            </div>
          </div>

          {/* Discovery & Usage */}
          <div className="grid md:grid-cols-2 gap-5">
            <div className="bg-white rounded-2xl p-6 shadow-card border border-line-soft">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-9 h-9 rounded-xl bg-purple-500/15 flex items-center justify-center">
                  <Microscope size={17} className="text-purple-600" />
                </div>
                <h3 className="text-base font-semibold text-ink font-serif">发现历史</h3>
              </div>
              <div className="space-y-3.5">
                {data.fx && (
                  <div className="bg-ivory rounded-xl p-4 border border-line-soft">
                    <p className="text-xs text-muted/60 mb-1">发现信息</p>
                    <p className="text-sm text-charcoal leading-relaxed">{data.fx}</p>
                  </div>
                )}
                {data.ly && (
                  <div className="bg-ivory rounded-xl p-4 border border-line-soft">
                    <p className="text-xs text-muted/60 mb-1">来源</p>
                    <p className="text-sm text-charcoal leading-relaxed">{data.ly}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-card border border-line-soft">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/15 flex items-center justify-center">
                  <Sparkles size={17} className="text-emerald-600" />
                </div>
                <h3 className="text-base font-semibold text-ink font-serif">用途</h3>
              </div>
              {data.yt ? (
                <div className="bg-ivory rounded-xl p-4 border border-line-soft">
                  <p className="text-sm text-charcoal leading-relaxed">{data.yt}</p>
                </div>
              ) : (
                <p className="text-sm text-muted/60">暂无详细用途数据</p>
              )}
            </div>
          </div>

          {/* Biological & Environmental */}
          {(data.xie || data.gu || data.gan || data.jr || data.hsz) && (
            <div className="bg-white rounded-2xl p-6 shadow-card border border-line-soft">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-9 h-9 rounded-xl bg-teal/15 flex items-center justify-center">
                  <Leaf size={17} className="text-teal" />
                </div>
                <h3 className="text-base font-semibold text-ink font-serif">生物与环境</h3>
              </div>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                {data.xie && <InfoCard icon={<Droplets size={14} />} label="血液中的存在" value={data.xie} />}
                {data.gu && <InfoCard icon={<User size={14} />} label="人体含量" value={`${data.gu} mg/L`} />}
                {data.gan && <InfoCard icon={<User size={14} />} label="肝脏含量" value={`${data.gan} mg/kg`} />}
                {data.jr && <InfoCard icon={<User size={14} />} label="肌肉含量" value={`${data.jr} mg/kg`} />}
                {data.hsz && <InfoCard icon={<Globe size={14} />} label="海水中的存在" value={data.hsz} />}
                {data.rtzl && <InfoCard icon={<User size={14} />} label="人体总质量" value={data.rtzl} />}
              </div>
            </div>
          )}
        </div>
      )}

      <ChatPanel section="chemical-element" currentData={data} />
    </div>
  );
}

// ==================== Sub Components ====================

function InfoItem({
  icon,
  label,
  value,
  unit,
  mono,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit?: string;
  mono?: boolean;
}) {
  return (
    <div className="flex flex-col">
      <span className="text-[11px] text-muted/60 mb-1 flex items-center gap-1">
        {icon}
        {label}
      </span>
      <span className={`text-sm font-medium text-ink ${mono ? 'font-mono' : ''}`}>
        {value || '--'}
        {unit && value ? <span className="text-xs text-muted/60 ml-0.5">{unit}</span> : null}
      </span>
    </div>
  );
}

function PropertyRow({
  label,
  value,
  unit,
  mono,
  fullWidth,
}: {
  label: string;
  value: string;
  unit?: string;
  mono?: boolean;
  fullWidth?: boolean;
}) {
  if (!value) return null;
  return (
    <div className={`flex items-start gap-3 ${fullWidth ? 'flex-col' : 'justify-between'}`}>
      <span className="text-xs text-muted/70 flex items-center gap-1.5 shrink-0">
        <ChevronRight size={12} className="text-amber-deep/60" />
        {label}
      </span>
      <span className={`text-sm text-charcoal text-right ${mono ? 'font-mono' : ''} ${fullWidth ? '' : 'max-w-[60%]'}`}>
        {value}
        {unit ? <span className="text-xs text-muted/50 ml-0.5">{unit}</span> : null}
      </span>
    </div>
  );
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-ivory rounded-xl p-4 border border-line-soft">
      <div className="flex items-center gap-1.5 text-xs text-muted/60 mb-1.5">
        {icon}
        {label}
      </div>
      <p className="text-sm text-charcoal font-medium leading-relaxed">{value}</p>
    </div>
  );
}

function getCategoryName(yht: string): string {
  const map: Record<string, string> = {
    'Ⅰ': '碱金属',
    'Ⅱ': '碱土金属',
    'Ⅲ': '过渡金属',
    'Ⅳ': '过渡金属',
    'Ⅴ': '过渡金属',
    'Ⅵ': '过渡金属',
    'Ⅶ': '过渡金属',
    'Ⅷ': '过渡金属',
    'Ⅸ': '过渡金属',
    'Ⅹ': '过渡金属',
    'Ⅺ': '过渡金属',
    'Ⅻ': '过渡金属',
  };
  return map[yht] || '过渡金属';
}
