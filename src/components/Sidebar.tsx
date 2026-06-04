import { NavLink, useLocation } from 'react-router-dom';
import {
  BookOpen,
  Search,
  Car,
  CalendarDays,
  X,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
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
  {
    path: '/driving-test',
    label: '驾考练习',
    icon: Car,
    description: '科目一/四模拟题',
  },
  {
    path: '/today-history',
    label: '历史上的今天',
    icon: CalendarDays,
    description: '以史为鉴，可知兴替',
  },
];

export default function Sidebar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

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
                <h1 className="text-lg font-bold text-white font-serif">ClearLearn</h1>
                <p className="text-xs text-white/60">综合学习智能体</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-4 px-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                      isActive
                        ? 'bg-amber text-ink shadow-md'
                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  <Icon size={20} />
                  <div className="flex-1">
                    <div className="text-sm font-medium">{item.label}</div>
                    <div className={`text-xs ${
                      location.pathname === item.path ? 'text-ink/60' : 'text-white/40'
                    }`}>
                      {item.description}
                    </div>
                  </div>
                </NavLink>
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
