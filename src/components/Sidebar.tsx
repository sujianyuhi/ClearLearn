import { NavLink, useLocation } from 'react-router-dom';
import {
  BookOpen,
  Search,
  Car,
  CalendarDays,
  Swords,
  Languages,
  X,
  ChevronRight,
  ChevronDown,
  Quote,
  Atom,
  FlaskConical,
  Calculator,
  BookMarked,
  Sparkles,
  ScrollText,
  GraduationCap,
  History,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import WeatherWidget from './WeatherWidget';

const categories = [
  {
    title: '语文学习',
    icon: BookMarked,
    accent: 'amber' as const,
    items: [
      { path: '/proverbs', label: '随机谚语', icon: Quote, description: '品味中华传统智慧' },
      { path: '/idiom', label: '成语字典', icon: BookMarked, description: '查成语释义、出处与用法' },
      { path: '/idioms', label: '随机成语', icon: Sparkles, description: '探寻中华成语之美' },
      { path: '/poetry', label: '古诗文大全', icon: ScrollText, description: '探寻千年诗词之美' },
    ],
  },
  {
    title: '数学学习',
    icon: Calculator,
    accent: 'teal' as const,
    items: [
      { path: '/math-quiz', label: '小学数学挑战', icon: Calculator, description: '每日一题，锻炼思维' },
    ],
  },
  {
    title: '英语学习',
    icon: Languages,
    accent: 'sky' as const,
    items: [
      { path: '/daily-english', label: '每日英语', icon: BookOpen, description: '每日一词，积少成多' },
      { path: '/word-detail', label: '单词详解', icon: Search, description: '深度解析词汇用法' },
    ],
  },
  {
    title: '历史学习',
    icon: History,
    accent: 'rose' as const,
    items: [
      { path: '/today-history', label: '历史上的今天', icon: CalendarDays, description: '以史为鉴，可知兴替' },
      { path: '/sanguo-heroes', label: '三国人物志', icon: Swords, description: '煮酒论英雄，探寻风云人物' },
    ],
  },
  {
    title: '化学学习',
    icon: FlaskConical,
    accent: 'emerald' as const,
    items: [
      { path: '/chemical-element', label: '元素周期表', icon: Atom, description: '探索化学元素的奥秘' },
      { path: '/equation-balancer', label: '方程式配平', icon: FlaskConical, description: '智能配平化学方程式' },
    ],
  },
  {
    title: '实用工具',
    icon: GraduationCap,
    accent: 'purple' as const,
    items: [
      { path: '/translator', label: '聚合翻译', icon: Languages, description: '支持 13 种语言互译' },
      { path: '/driving-test', label: '驾考练习', icon: Car, description: '科目一/四模拟题' },
    ],
  },
];

const accentColors = {
  amber: { bg: 'bg-amber/15', text: 'text-amber', ring: 'ring-amber/20', activeBg: 'bg-amber/12' },
  teal: { bg: 'bg-teal/15', text: 'text-teal', ring: 'ring-teal/20', activeBg: 'bg-teal/12' },
  sky: { bg: 'bg-sky-400/15', text: 'text-sky-400', ring: 'ring-sky-400/20', activeBg: 'bg-sky-400/12' },
  rose: { bg: 'bg-rose-400/15', text: 'text-rose-400', ring: 'ring-rose-400/20', activeBg: 'bg-rose-400/12' },
  emerald: { bg: 'bg-emerald-400/15', text: 'text-emerald-400', ring: 'ring-emerald-400/20', activeBg: 'bg-emerald-400/12' },
  purple: { bg: 'bg-purple-400/15', text: 'text-purple-400', ring: 'ring-purple-400/20', activeBg: 'bg-purple-400/12' },
};

export default function Sidebar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const getInitialExpanded = () => {
    const initial: Record<string, boolean> = {};
    categories.forEach((cat) => {
      initial[cat.title] = cat.items.some((item) => location.pathname === item.path);
    });
    return initial;
  };

  const [expanded, setExpanded] = useState<Record<string, boolean>>(getInitialExpanded);

  useEffect(() => {
    setExpanded((prev) => {
      const next = { ...prev };
      let changed = false;
      categories.forEach((cat) => {
        const shouldExpand = cat.items.some((item) => location.pathname === item.path);
        if (shouldExpand && !next[cat.title]) {
          next[cat.title] = true;
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, [location.pathname]);

  const toggleCategory = (title: string) => {
    setExpanded((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-50 p-2.5 rounded-xl bg-ink text-amber shadow-xl md:hidden backdrop-blur-sm border border-white/10 hover:scale-105 active:scale-95 transition-all duration-300"
        aria-label={mobileOpen ? '关闭菜单' : '打开菜单'}
      >
        {mobileOpen ? <X size={18} /> : <ChevronRight size={18} />}
      </button>

      {/* Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-30 md:hidden animate-fade-in"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full bg-ink text-ivory z-40 transition-transform duration-500 ease-out-soft w-64 md:translate-x-0 ${
          mobileOpen ? 'translate-x-0 shadow-panel' : '-translate-x-full'
        }`}
      >
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink to-ink-deep pointer-events-none" />
        {/* Animated aurora blobs */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber/8 rounded-full blur-3xl pointer-events-none animate-breathe" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-1/3 left-0 w-36 h-36 bg-teal/6 rounded-full blur-3xl pointer-events-none animate-breathe" style={{ animationDuration: '6s', animationDelay: '2s' }} />
        <div className="absolute top-1/2 right-0 w-24 h-24 bg-amber-light/5 rounded-full blur-2xl pointer-events-none animate-breathe" style={{ animationDuration: '10s', animationDelay: '4s' }} />
        {/* Subtle noise texture */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }} />

        <div className="relative flex flex-col h-full">
          {/* Logo */}
          <div className="p-5 border-b border-white/8">
            <div className="flex items-center gap-3 group cursor-default">
              <div className="relative">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber to-amber-deep flex items-center justify-center shadow-lg shadow-amber/20 ring-1 ring-white/10 group-hover:shadow-xl group-hover:shadow-amber/30 transition-all duration-500 group-hover:scale-105 group-hover:rotate-3">
                  <BookOpen className="text-ink" size={20} strokeWidth={2.2} />
                </div>
                {/* Orbiting dot */}
                <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-teal rounded-full border-2 border-ink animate-breathe" style={{ animationDuration: '3s' }} />
                {/* Glow ring behind icon */}
                <div className="absolute inset-0 rounded-xl bg-amber/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-125" />
              </div>
              <div className="leading-tight">
                <h1 className="text-lg font-bold text-white font-serif tracking-wide group-hover:text-amber transition-colors duration-300">
                  ClearLearn
                </h1>
                <p className="text-[11px] text-white/50 mt-0.5">综合学习智能体</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-4 px-3 overflow-y-auto scrollbar-thin">
            {categories.map((cat) => {
              const CatIcon = cat.icon;
              const isExpanded = expanded[cat.title];
              const hasActiveChild = cat.items.some((item) => location.pathname === item.path);
              const a = accentColors[cat.accent];

              return (
                <div key={cat.title} className="mb-1">
                  <button
                    onClick={() => toggleCategory(cat.title)}
                    className={`group w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-300 ${
                      hasActiveChild
                        ? `${a.bg} ${a.text}`
                        : 'text-white/65 hover:bg-white/6 hover:text-white'
                    }`}
                  >
                    <CatIcon
                      size={17}
                      className={`transition-all duration-300 ${hasActiveChild ? '' : 'group-hover:scale-110 group-hover:text-white'}`}
                    />
                    <span className="text-sm font-medium flex-1 text-left tracking-wide">
                      {cat.title}
                    </span>
                    {hasActiveChild && (
                      <span className={`w-1.5 h-1.5 rounded-full ${a.text.replace('text-', 'bg-')} opacity-70 animate-pulse-soft`} />
                    )}
                    <ChevronDown
                      size={13}
                      className={`transition-all duration-300 ${isExpanded ? 'rotate-180' : 'opacity-40 group-hover:opacity-70'}`}
                    />
                  </button>

                  <div
                    className={`grid transition-all duration-300 ease-out-soft ${
                      isExpanded ? 'grid-rows-[1fr] opacity-100 mt-1' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="mb-2 space-y-0.5 pl-3 border-l border-white/8 ml-5">
                        {cat.items.map((item) => {
                          const Icon = item.icon;
                          return (
                            <NavLink
                              key={item.path}
                              to={item.path}
                              onClick={() => setMobileOpen(false)}
                              className={({ isActive }) =>
                                `group flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-all duration-300 relative overflow-hidden ${
                                  isActive
                                    ? 'bg-gradient-to-r from-amber to-amber-deep text-ink shadow-md shadow-amber/20 font-semibold scale-[1.02]'
                                    : 'text-white/60 hover:bg-white/6 hover:text-white hover:translate-x-1'
                                }`
                              }
                            >
                              {({ isActive }) => (
                                <>
                                  {/* Active shimmer effect */}
                                  {isActive && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer-bar" />
                                  )}
                                  <Icon size={14} className="flex-shrink-0 transition-transform duration-300 group-hover:scale-110 relative z-10" />
                                  <div className="flex-1 min-w-0 relative z-10">
                                    <div className="text-[13px] leading-tight">{item.label}</div>
                                    <div
                                      className={`text-[10.5px] mt-0.5 leading-snug truncate transition-colors ${
                                        isActive
                                          ? 'text-ink/50'
                                          : 'text-white/30 group-hover:text-white/40'
                                      }`}
                                    >
                                      {item.description}
                                    </div>
                                  </div>
                                </>
                              )}
                            </NavLink>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </nav>

          {/* Weather */}
          <WeatherWidget />

          {/* Footer */}
          <div className="px-4 py-3 border-t border-white/8 relative">
            {/* Gradient line accent */}
            <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-amber/20 to-transparent" />
            <div className="flex items-center justify-center gap-1.5">
              <div className="w-1 h-1 rounded-full bg-teal animate-breathe" style={{ animationDuration: '3s', animationDelay: '0ms' }} />
              <p className="text-[10.5px] text-white/35 tracking-wider transition-colors duration-300 hover:text-white/50 cursor-default">
                ClearLearn v1.0 · DeepSeek
              </p>
              <div className="w-1 h-1 rounded-full bg-amber animate-breathe" style={{ animationDuration: '3s', animationDelay: '1.5s' }} />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}