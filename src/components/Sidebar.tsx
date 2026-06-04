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

const categories = [
  {
    title: '语文学习',
    icon: BookMarked,
    items: [
      {
        path: '/proverbs',
        label: '随机谚语',
        icon: Quote,
        description: '品味中华传统智慧',
      },
      {
        path: '/idiom',
        label: '成语字典',
        icon: BookMarked,
        description: '查成语释义、出处与用法',
      },
      {
        path: '/idioms',
        label: '随机成语',
        icon: Sparkles,
        description: '探寻中华成语之美',
      },
      {
        path: '/poetry',
        label: '古诗文大全',
        icon: ScrollText,
        description: '探寻千年诗词之美',
      },
    ],
  },
  {
    title: '数学学习',
    icon: Calculator,
    items: [
      {
        path: '/math-quiz',
        label: '小学数学挑战',
        icon: Calculator,
        description: '每日一题，锻炼思维',
      },
    ],
  },
  {
    title: '英语学习',
    icon: Languages,
    items: [
      {
        path: '/daily-english',
        label: '每日英语',
        icon: BookOpen,
        description: '每日一词，积少成多',
      },
      {
        path: '/word-detail',
        label: '单词详解',
        icon: Search,
        description: '深度解析词汇用法',
      },
    ],
  },
  {
    title: '历史学习',
    icon: History,
    items: [
      {
        path: '/today-history',
        label: '历史上的今天',
        icon: CalendarDays,
        description: '以史为鉴，可知兴替',
      },
      {
        path: '/sanguo-heroes',
        label: '三国人物志',
        icon: Swords,
        description: '煮酒论英雄，探寻风云人物',
      },
    ],
  },
  {
    title: '化学学习',
    icon: FlaskConical,
    items: [
      {
        path: '/chemical-element',
        label: '元素周期表',
        icon: Atom,
        description: '探索化学元素的奥秘',
      },
      {
        path: '/equation-balancer',
        label: '方程式配平',
        icon: FlaskConical,
        description: '智能配平化学方程式',
      },
    ],
  },
  {
    title: '实用工具',
    icon: GraduationCap,
    items: [
      {
        path: '/translator',
        label: '聚合翻译',
        icon: Languages,
        description: '支持 13 种语言互译',
      },
      {
        path: '/driving-test',
        label: '驾考练习',
        icon: Car,
        description: '科目一/四模拟题',
      },
    ],
  },
];

export default function Sidebar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const getInitialExpanded = () => {
    const initial: Record<string, boolean> = {};
    categories.forEach((cat) => {
      initial[cat.title] = cat.items.some(
        (item) => location.pathname === item.path
      );
    });
    return initial;
  };

  const [expanded, setExpanded] = useState<Record<string, boolean>>(
    getInitialExpanded
  );

  useEffect(() => {
    setExpanded((prev) => {
      const next = { ...prev };
      let changed = false;
      categories.forEach((cat) => {
        const shouldExpand = cat.items.some(
          (item) => location.pathname === item.path
        );
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
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-ink text-ivory shadow-lg md:hidden"
      >
        {mobileOpen ? <X size={20} /> : <ChevronRight size={20} />}
      </button>

      {/* Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full bg-ink text-ivory z-40 transition-transform duration-300 ease-in-out
          w-64 md:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber flex items-center justify-center">
                <BookOpen className="text-ink" size={22} />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white font-serif">
                  ClearLearn
                </h1>
                <p className="text-xs text-white/60">综合学习智能体</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-4 px-3 overflow-y-auto scrollbar-thin">
            {categories.map((cat) => {
              const CatIcon = cat.icon;
              const isExpanded = expanded[cat.title];
              const hasActiveChild = cat.items.some(
                (item) => location.pathname === item.path
              );

              return (
                <div key={cat.title} className="mb-1">
                  <button
                    onClick={() => toggleCategory(cat.title)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors duration-200 ${
                      hasActiveChild
                        ? 'text-amber'
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <CatIcon size={18} />
                    <span className="text-sm font-medium flex-1 text-left">
                      {cat.title}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isExpanded && (
                    <div className="mt-1 space-y-1 pl-2">
                      {cat.items.map((item) => {
                        const Icon = item.icon;
                        return (
                          <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={() => setMobileOpen(false)}
                            className={({ isActive }) =>
                              `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                                isActive
                                  ? 'bg-amber text-ink shadow-md'
                                  : 'text-white/70 hover:bg-white/10 hover:text-white'
                              }`
                            }
                          >
                            <Icon size={18} />
                            <div className="flex-1">
                              <div className="text-sm font-medium">
                                {item.label}
                              </div>
                              <div
                                className={`text-xs ${
                                  location.pathname === item.path
                                    ? 'text-ink/60'
                                    : 'text-white/40'
                                }`}
                              >
                                {item.description}
                              </div>
                            </div>
                          </NavLink>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-white/10">
            <p className="text-xs text-white/40 text-center">
              ClearLearn v1.0 · AI 由 DeepSeek 驱动
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
