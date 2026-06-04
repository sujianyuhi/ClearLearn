import { CalendarDays, Clock, MapPin } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import type { HistoryEventData } from '../types';
import LoadingCard from '../components/LoadingCard';
import ChatPanel from '../components/ChatPanel';

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
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-amber/20 flex items-center justify-center">
            <CalendarDays size={20} className="text-amber" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-ink font-serif">历史上的今天</h1>
            <p className="text-sm text-muted">回顾历史长河中的今天，汲取智慧与力量</p>
          </div>
        </div>
      </div>

      {/* Today Badge */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-ink flex items-center justify-center flex-shrink-0">
            <Clock size={28} className="text-amber" />
          </div>
          <div>
            <p className="text-sm text-muted mb-1">今天是</p>
            <h2 className="text-3xl font-bold text-ink font-serif">{monthDay}</h2>
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

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600 mb-3">{error}</p>
          <button
            onClick={refetch}
            className="px-4 py-2 bg-ink text-white rounded-lg text-sm hover:bg-ink/90 transition-colors"
          >
            重新加载
          </button>
        </div>
      )}

      {data && (
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-amber/30" />

          {/* Events */}
          <div className="space-y-6">
            {parsedEvents.map((event, index) => (
              <div
                key={index}
                className="relative pl-16 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Timeline Dot */}
                <div className="absolute left-4 top-5 w-5 h-5 rounded-full bg-amber border-4 border-ivory shadow-sm" />

                {/* Event Card */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin size={14} className="text-amber" />
                    <span className="text-sm font-medium text-ink">{event.date}</span>
                  </div>
                  <h3 className="text-lg font-medium text-ink font-serif leading-relaxed">
                    {event.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {data && data.length === 0 && (
        <div className="text-center py-16">
          <CalendarDays size={32} className="mx-auto mb-3 text-muted" />
          <p className="text-muted">暂无今日历史事件数据</p>
        </div>
      )}

      <ChatPanel section="today-history" currentData={data} />
    </div>
  );
}
