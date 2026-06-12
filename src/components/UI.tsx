import type { ReactNode, ElementType } from 'react';
import { AlertCircle, type LucideIcon } from 'lucide-react';

// ==================== PageHeader ====================

interface PageHeaderProps {
  icon: LucideIcon | ElementType;
  title: string;
  description?: string;
  accent?: 'amber' | 'teal' | 'ink' | 'emerald' | 'rose' | 'sky' | 'purple' | 'orange';
  children?: ReactNode;
}

const accentMap = {
  amber: {
    bg: 'bg-amber/12',
    icon: 'text-amber-deep',
    ring: 'ring-amber/20',
    bar: 'from-amber/60 via-amber to-amber/60',
    glow: 'bg-amber/25',
    dot: 'bg-amber',
  },
  teal: {
    bg: 'bg-teal/12',
    icon: 'text-teal',
    ring: 'ring-teal/20',
    bar: 'from-teal/60 via-teal to-teal/60',
    glow: 'bg-teal/25',
    dot: 'bg-teal',
  },
  ink: {
    bg: 'bg-ink/8',
    icon: 'text-ink',
    ring: 'ring-ink/15',
    bar: 'from-ink/60 via-ink to-ink/60',
    glow: 'bg-ink/15',
    dot: 'bg-ink',
  },
  emerald: {
    bg: 'bg-emerald-500/12',
    icon: 'text-emerald-600',
    ring: 'ring-emerald-500/20',
    bar: 'from-emerald-500/60 via-emerald-500 to-emerald-500/60',
    glow: 'bg-emerald-500/25',
    dot: 'bg-emerald-500',
  },
  rose: {
    bg: 'bg-rose-500/12',
    icon: 'text-rose-600',
    ring: 'ring-rose-500/20',
    bar: 'from-rose-500/60 via-rose-500 to-rose-500/60',
    glow: 'bg-rose-500/25',
    dot: 'bg-rose-500',
  },
  sky: {
    bg: 'bg-sky-500/12',
    icon: 'text-sky-600',
    ring: 'ring-sky-500/20',
    bar: 'from-sky-500/60 via-sky-500 to-sky-500/60',
    glow: 'bg-sky-500/25',
    dot: 'bg-sky-500',
  },
  purple: {
    bg: 'bg-purple-500/12',
    icon: 'text-purple-600',
    ring: 'ring-purple-500/20',
    bar: 'from-purple-500/60 via-purple-500 to-purple-500/60',
    glow: 'bg-purple-500/25',
    dot: 'bg-purple-500',
  },
  orange: {
    bg: 'bg-orange-500/12',
    icon: 'text-orange-600',
    ring: 'ring-orange-500/20',
    bar: 'from-orange-500/60 via-orange-500 to-orange-500/60',
    glow: 'bg-orange-500/25',
    dot: 'bg-orange-500',
  },
};

export function PageHeader({
  icon: Icon,
  title,
  description,
  accent = 'amber',
  children,
}: PageHeaderProps) {
  const a = accentMap[accent];

  return (
    <div className="mb-8 flex items-start justify-between gap-4 flex-wrap animate-fade-in-down">
      <div className="flex items-center gap-4">
        <div className="relative group">
          {/* Icon background glow */}
          <div className={`absolute inset-0 ${a.glow} rounded-2xl blur-xl scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
          {/* Morphing decorative blob */}
          <div className={`absolute -inset-3 ${a.glow} rounded-full blur-2xl opacity-30 animate-breathe`} style={{ animationDuration: '5s' }} />
          {/* Icon container */}
          <div
            className={`relative w-12 h-12 rounded-2xl ${a.bg} ${a.icon} flex items-center justify-center ring-1 ${a.ring} shadow-sm group-hover:shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:rotate-3`}
          >
            <Icon size={22} strokeWidth={1.8} />
          </div>
          {/* Decorative dot accent */}
          <div
            className={`absolute -top-1 -right-1 w-2.5 h-2.5 ${a.dot} rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 scale-0 group-hover:scale-100`}
          />
          {/* Bottom accent bar */}
          <div
            className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-gradient-to-r ${a.bar} opacity-60 group-hover:opacity-100 group-hover:w-10 transition-all duration-500`}
          />
        </div>
        <div>
          <h1 className="text-[26px] font-bold text-ink font-serif leading-tight tracking-tight">
            {title}
          </h1>
          {description && (
            <p className="text-sm text-muted mt-1 leading-relaxed max-w-md">{description}</p>
          )}
        </div>
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}

// ==================== SectionTitle ====================

interface SectionTitleProps {
  icon?: LucideIcon | ElementType;
  title: string;
  accent?: 'amber' | 'teal' | 'ink' | 'emerald' | 'rose' | 'sky' | 'purple' | 'orange';
  count?: string | number;
  children?: ReactNode;
}

const sectionAccent = {
  amber: { bg: 'bg-amber/12', text: 'text-amber-deep', dot: 'bg-amber' },
  teal: { bg: 'bg-teal/12', text: 'text-teal', dot: 'bg-teal' },
  ink: { bg: 'bg-ink/8', text: 'text-ink', dot: 'bg-ink' },
  emerald: { bg: 'bg-emerald-500/12', text: 'text-emerald-600', dot: 'bg-emerald-500' },
  rose: { bg: 'bg-rose-500/12', text: 'text-rose-600', dot: 'bg-rose-500' },
  sky: { bg: 'bg-sky-500/12', text: 'text-sky-600', dot: 'bg-sky-500' },
  purple: { bg: 'bg-purple-500/12', text: 'text-purple-600', dot: 'bg-purple-500' },
  orange: { bg: 'bg-orange-500/12', text: 'text-orange-600', dot: 'bg-orange-500' },
};

export function SectionTitle({ icon: Icon, title, accent = 'amber', count, children }: SectionTitleProps) {
  const a = sectionAccent[accent];

  return (
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-2.5">
        {Icon && (
          <div className={`w-8 h-8 rounded-lg ${a.bg} ${a.text} flex items-center justify-center group-hover:scale-105 transition-transform duration-300`}>
            <Icon size={16} strokeWidth={2} />
          </div>
        )}
        <h3 className="text-base font-semibold text-ink font-serif tracking-wide">{title}</h3>
        {count !== undefined && (
          <span className="text-xs text-muted/50 bg-ivory px-2 py-0.5 rounded-md font-medium border border-line-soft">
            {count}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

// ==================== OrnamentDivider ====================

export function OrnamentDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 my-6 ${className}`}>
      <div className="h-px flex-1 max-w-16 bg-gradient-to-r from-transparent to-amber/30" />
      <div className="flex items-center gap-1.5 text-amber/50">
        <div className="w-1 h-1 rounded-full bg-amber/60 animate-pulse-soft" style={{ animationDelay: '0ms' }} />
        <div className="w-1.5 h-1.5 rounded-full bg-amber animate-pulse-soft" style={{ animationDelay: '300ms' }} />
        <div className="w-1 h-1 rounded-full bg-amber/60 animate-pulse-soft" style={{ animationDelay: '600ms' }} />
      </div>
      <div className="h-px flex-1 max-w-16 bg-gradient-to-l from-transparent to-amber/30" />
    </div>
  );
}

// ==================== LoadingCard ====================

export function LoadingCard() {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-card border border-line-soft overflow-hidden relative animate-fade-in">
      {/* Shimmer bar at top */}
      <div className="absolute top-0 left-0 right-0 h-0.5">
        <div className="h-full bg-gradient-to-r from-transparent via-amber/60 to-transparent animate-shimmer-bar" />
      </div>
      {/* Gradient accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber/20 to-transparent" />
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl skeleton" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-1/3 rounded-md skeleton" />
            <div className="h-3 w-1/2 rounded-md skeleton" />
          </div>
        </div>
        <div className="space-y-2.5">
          <div className="h-3.5 w-full rounded-md skeleton" />
          <div className="h-3.5 w-11/12 rounded-md skeleton" />
          <div className="h-3.5 w-4/5 rounded-md skeleton" />
          <div className="h-3.5 w-3/4 rounded-md skeleton" />
        </div>
        <div className="flex gap-2 pt-2">
          <div className="h-8 w-20 rounded-lg skeleton" />
          <div className="h-8 w-24 rounded-lg skeleton" />
        </div>
      </div>
    </div>
  );
}

export function LoadingText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2.5">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-3.5 rounded-md skeleton"
          style={{ width: `${[100, 88, 72, 90, 60][i % 5]}%` }}
        />
      ))}
    </div>
  );
}

// ==================== EmptyState ====================

interface EmptyStateProps {
  icon: LucideIcon | ElementType;
  title: string;
  description?: string;
  children?: ReactNode;
}

export function EmptyState({ icon: Icon, title, description, children }: EmptyStateProps) {
  return (
    <div className="text-center py-16 px-6 animate-scale-reveal">
      <div className="relative inline-flex mb-5">
        <div className="absolute inset-0 bg-amber/20 rounded-3xl blur-xl scale-150 animate-breathe" style={{ animationDuration: '4s' }} />
        <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-amber/15 to-amber/5 flex items-center justify-center border border-amber/15 shadow-glow-amber">
          <Icon size={36} strokeWidth={1.5} className="text-amber-deep" />
        </div>
      </div>
      <h3 className="text-lg font-semibold text-ink mb-2 font-serif tracking-wide">{title}</h3>
      {description && (
        <p className="text-sm text-muted max-w-sm mx-auto leading-relaxed">{description}</p>
      )}
      {children && <div className="mt-6 flex flex-wrap justify-center gap-2">{children}</div>}
    </div>
  );
}

// ==================== ErrorState ====================

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryText?: string;
}

export function ErrorState({ title = '出错了', message, onRetry, retryText = '重新加载' }: ErrorStateProps) {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-card border border-rose-100 text-center animate-scale-reveal relative overflow-hidden">
      {/* Top gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rose-300/40 to-transparent" />
      <div className="relative inline-flex mb-4">
        <div className="absolute inset-0 bg-rose-100 rounded-2xl blur-xl scale-150 animate-breathe" style={{ animationDuration: '4s' }} />
        <div className="relative w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center border border-rose-100">
          <AlertCircle size={22} className="text-rose-500" strokeWidth={2} />
        </div>
      </div>
      <h3 className="text-base font-semibold text-ink mb-1.5 font-serif">{title}</h3>
      <p className="text-sm text-muted mb-5 max-w-sm mx-auto leading-relaxed">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-ink to-ink-light text-white rounded-xl text-sm font-medium hover:from-ink-light hover:to-ink hover:shadow-xl active:scale-95 transition-all duration-300 shadow-md btn-lift"
        >
          {retryText}
        </button>
      )}
    </div>
  );
}

// ==================== InfoCard ====================

interface InfoCardProps {
  icon: ReactNode;
  title: string;
  accent?: 'amber' | 'teal' | 'ink' | 'emerald' | 'rose' | 'sky' | 'purple' | 'orange';
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}

const infoAccent = {
  amber: { bg: 'bg-amber/10', text: 'text-amber-deep' },
  teal: { bg: 'bg-teal/10', text: 'text-teal' },
  ink: { bg: 'bg-ink/8', text: 'text-ink' },
  emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-600' },
  rose: { bg: 'bg-rose-500/10', text: 'text-rose-600' },
  sky: { bg: 'bg-sky-500/10', text: 'text-sky-600' },
  purple: { bg: 'bg-purple-500/10', text: 'text-purple-600' },
  orange: { bg: 'bg-orange-500/10', text: 'text-orange-600' },
};

export function InfoCard({ icon, title, accent = 'amber', children, className = '', contentClassName = '' }: InfoCardProps) {
  const a = infoAccent[accent];

  return (
    <div className={`bg-white rounded-2xl p-6 shadow-card border border-line-soft transition-all duration-400 hover:shadow-card-hover hover:-translate-y-1 shine-on-hover relative overflow-hidden ${className}`}>
      {/* Top gradient accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber/30 to-transparent" />
      <SectionTitle
        icon={() => <span className={a.text}>{icon}</span>}
        title={title}
        accent={accent}
      />
      <div className={contentClassName}>{children}</div>
    </div>
  );
}

// ==================== Tag ====================

interface TagProps {
  children: ReactNode;
  variant?: 'amber' | 'ink' | 'emerald' | 'rose' | 'sky' | 'purple' | 'orange' | 'teal' | 'neutral';
  size?: 'sm' | 'md';
  className?: string;
}

const tagColors = {
  amber: 'bg-amber/10 text-amber-deep border-amber/15 hover:bg-amber/15 hover:border-amber/25',
  ink: 'bg-ink/8 text-ink border-ink/10 hover:bg-ink/12 hover:border-ink/20',
  emerald: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/15 hover:bg-emerald-500/15 hover:border-emerald-500/25',
  rose: 'bg-rose-500/10 text-rose-700 border-rose-500/15 hover:bg-rose-500/15 hover:border-rose-500/25',
  sky: 'bg-sky-500/10 text-sky-700 border-sky-500/15 hover:bg-sky-500/15 hover:border-sky-500/25',
  purple: 'bg-purple-500/10 text-purple-700 border-purple-500/15 hover:bg-purple-500/15 hover:border-purple-500/25',
  orange: 'bg-orange-500/10 text-orange-700 border-orange-500/15 hover:bg-orange-500/15 hover:border-orange-500/25',
  teal: 'bg-teal/10 text-teal border-teal/15 hover:bg-teal/15 hover:border-teal/25',
  neutral: 'bg-ivory text-charcoal border-line hover:bg-ivory-deep hover:border-line',
};

export function Tag({ children, variant = 'amber', size = 'sm', className = '' }: TagProps) {
  const sizeClass = size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-sm';
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-lg border font-medium transition-all duration-200 cursor-default ${tagColors[variant]} ${sizeClass} ${className}`}
    >
      {children}
    </span>
  );
}

// ==================== ActionButton ====================

interface ActionButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  className?: string;
  type?: 'button' | 'submit';
}

export function ActionButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  className = '',
  type = 'button',
}: ActionButtonProps) {
  const variantClass = {
    primary: 'bg-gradient-to-r from-ink to-ink-light text-white hover:from-ink-light hover:to-ink shadow-md hover:shadow-xl hover:shadow-ink/25',
    secondary: 'bg-white border border-line text-ink hover:border-amber/40 hover:bg-amber/5 hover:shadow-md',
    ghost: 'bg-transparent text-ink hover:bg-ink/5',
  }[variant];

  const sizeClass = {
    sm: 'px-3 py-1.5 text-xs rounded-lg',
    md: 'px-5 py-2.5 text-sm rounded-xl',
    lg: 'px-6 py-3 text-sm rounded-xl',
  }[size];

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 font-medium transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 btn-lift ${variantClass} ${sizeClass} ${className}`}
    >
      {loading ? (
        <div className="w-3.5 h-3.5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
      ) : icon}
      {children}
    </button>
  );
}

// ==================== SearchInput ====================

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  icon?: LucideIcon;
  rightAction?: ReactNode;
  className?: string;
  size?: 'md' | 'lg';
}

export function SearchInput({
  value,
  onChange,
  onSubmit,
  placeholder,
  icon: Icon,
  rightAction,
  className = '',
  size = 'lg',
}: SearchInputProps) {
  const sizeClass = size === 'lg' ? 'py-3.5 text-sm' : 'py-3 text-sm';

  return (
    <div
      className={`flex items-center gap-2 bg-ivory rounded-2xl px-4 ${sizeClass} border border-amber/10 focus-within:border-amber/40 focus-within:ring-2 focus-within:ring-amber/15 focus-within:bg-white focus-within:shadow-lg focus-within:shadow-amber/5 transition-all duration-400 ${className}`}
    >
      {Icon && <Icon size={18} className="text-muted/60 flex-shrink-0 transition-colors duration-300 group-focus-within:text-amber-deep" />}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && onSubmit) onSubmit();
        }}
        placeholder={placeholder}
        className="flex-1 bg-transparent outline-none text-charcoal placeholder:text-muted/50"
      />
      {rightAction}
    </div>
  );
}