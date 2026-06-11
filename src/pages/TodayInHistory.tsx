import { CalendarDays, Clock, MapPin } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import type { HistoryEventData } from '../types';
import LoadingCard from '../components/LoadingCard';
import ChatPanel from '../components/ChatPanel';
import { PageHeader, ErrorState, EmptyState, ActionButton } from '../components/UI';

interface ParsedHistoryEvent {
  date: string;
  title: string;
}

function parseHistoryEvent(eventStr: string): ParsedHistoryEvent {
  // Format: "1990年06月04日 美国首次实行安乐死"
  const match = eventStr.match(/^(\d{4}年\d{2}月\d{2}日)\s+(.+)$/);
  if (match) {
    return {
      date: match[1],
      title: match[2],
    };
  }
  return {
    date: '',
    title: eventStr,
  };
}

export default function TodayInHistory() {
  const today = new Date();
  const monthDay = `${today.getMonth() + 1}月${today.getDate()}日`;

  const { data, loading, error, refetch } = useApi<HistoryEventData[]>(
    'https://v2.xxapi.cn/api/history',
    { immediate: true }
  );

  const parsedEvents = data?.map(parseHistoryEvent) || [];

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        icon={CalendarDays}
        title="历史上的今天"
        description="回顾历史长河中的今天，汲取智慧与力量"
        accent="amber"
      >
        <ActionButton
          onClick={refetch}
          loading={loading}
          variant="secondary"
          size="md"
          icon={<Clock size={15} />}
        >
          刷新
        </ActionButton>
      </PageHeader>

      {/* Today Badge */}
      <div className="relative bg-white rounded-2xl p-6 shadow-card border border-line-soft mb-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-ink/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-amber/20 rounded-2xl blur-lg scale-110" />
            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-ink to-ink-deep flex items-center justify-center flex-shrink-0 shadow-lg shadow-ink/20">
              <Clock size={28} className="text-amber" />
            </div>
          </div>
          <div>
            <p className="text-sm text-muted mb-1">今天是</p>
            <h2 className="text-3xl font-bold text-ink font-serif tracking-tight">{monthDay}</h2>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading && (
        <div className="space-y-4">
          <LoadingCard />
          <LoadingCard />
          <LoadingCard />
        </div>
      )}

      {error && <ErrorState message={error} onRetry={refetch} />}

      {data && (
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber/50 via-amber/30 to-transparent" />

          {/* Events */}
          <div className="space-y-5">
            {parsedEvents.map((event, index) => (
              <div
                key={index}
                className="relative pl-16 animate-fade-in-up"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                {/* Timeline Dot */}
                <div className="absolute left-[18px] top-6 w-3.5 h-3.5 rounded-full bg-gradient-to-br from-amber to-amber-deep border-4 border-ivory shadow-sm" />

                {/* Event Card */}
                <div className="bg-white rounded-2xl p-6 shadow-card border border-line-soft hover:shadow-card-hover hover:border-amber/30 transition-all duration-300">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-md bg-amber/15 flex items-center justify-center">
                      <MapPin size={12} className="text-amber-deep" />
                    </div>
                    <span className="text-sm font-medium text-ink font-mono tracking-wide">{event.date}</span>
                  </div>
                  <h3 className="text-base font-medium text-charcoal font-serif leading-relaxed">
                    {event.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {data && data.length === 0 && !loading && (
        <div className="bg-white rounded-2xl border border-line-soft shadow-card">
          <EmptyState
            icon={CalendarDays}
            title="暂无今日历史事件"
            description="今日没有查询到历史事件数据"
          />
        </div>
      )}

      <ChatPanel section="today-history" currentData={data} />
    </div>
  );
}
