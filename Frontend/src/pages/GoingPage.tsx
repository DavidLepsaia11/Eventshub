// src/pages/GoingPage.tsx
// Visitor-only page — shows events the current user has RSVPed to, with Month and List views.

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Calendar,
} from 'lucide-react';
import {
  format,
  parseISO,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
} from 'date-fns';
import { fetchGoingEvents } from '@/api/attendance';
import { resolveMediaUrl } from '@/api/events';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import type { EventDto } from '@/types/event';

// ─── Chip colour palette — cycles by event.id % 4 ────────────────────────────

const CHIP_COLORS = [
  'bg-blue-500   text-white',
  'bg-violet-500 text-white',
  'bg-green-500  text-white',
  'bg-amber-500  text-white',
] as const;

function chipColor(eventId: number): string {
  return CHIP_COLORS[eventId % CHIP_COLORS.length];
}

// ─── Month calendar view ──────────────────────────────────────────────────────

const DAY_HEADERS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface MonthViewProps {
  events: EventDto[];
  currentMonth: Date;
  onPrev: () => void;
  onNext: () => void;
}

function MonthView({ events, currentMonth, onPrev, onNext }: MonthViewProps) {
  const navigate = useNavigate();

  // Build the full 6-week grid that covers the month
  const monthStart   = startOfMonth(currentMonth);
  const monthEnd     = endOfMonth(currentMonth);
  const gridStart    = startOfWeek(monthStart, { weekStartsOn: 0 });
  const gridEnd      = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const allDays      = eachDayOfInterval({ start: gridStart, end: gridEnd });

  function eventsOnDay(day: Date): EventDto[] {
    return events.filter((e) => isSameDay(parseISO(e.startDate), day));
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={onPrev}
          className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-[15px] font-bold text-slate-800 tracking-[-0.2px]">
          {format(currentMonth, 'MMMM yyyy')}
        </span>
        <button
          onClick={onNext}
          className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAY_HEADERS.map((d) => (
          <div
            key={d}
            className="text-center text-[11px] font-bold uppercase tracking-[0.5px] text-slate-400 py-1.5"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Date cells */}
      <div className="grid grid-cols-7 border-l border-t border-slate-200">
        {allDays.map((day) => {
          const inMonth     = isSameMonth(day, currentMonth);
          const todayCell   = isToday(day);
          const dayEvents   = eventsOnDay(day);

          return (
            <div
              key={day.toISOString()}
              className={[
                'border-r border-b border-slate-200 min-h-[90px] p-1.5',
                inMonth ? 'bg-white' : 'bg-slate-50',
              ].join(' ')}
            >
              {/* Day number */}
              <div className="flex justify-end mb-1">
                <span
                  className={[
                    'w-6 h-6 flex items-center justify-center rounded-full text-[12px] font-semibold',
                    todayCell
                      ? 'bg-brand-600 text-white'
                      : inMonth
                        ? 'text-slate-700'
                        : 'text-slate-300',
                  ].join(' ')}
                >
                  {format(day, 'd')}
                </span>
              </div>

              {/* Event chips */}
              <div className="flex flex-col gap-0.5">
                {dayEvents.map((event) => (
                  <button
                    key={event.id}
                    onClick={() => navigate(`/events/${event.id}`)}
                    className={[
                      'w-full text-left px-1.5 py-0.5 rounded text-[10.5px] font-medium truncate transition-opacity hover:opacity-80',
                      chipColor(event.id),
                    ].join(' ')}
                  >
                    {event.title}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── List view ────────────────────────────────────────────────────────────────

interface ListViewProps {
  events: EventDto[];
}

function ListView({ events }: ListViewProps) {
  const navigate = useNavigate();

  const sorted = [...events].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
  );

  if (sorted.length === 0) return null;

  return (
    <div className="flex flex-col divide-y divide-slate-100">
      {sorted.map((event) => (
        <button
          key={event.id}
          onClick={() => navigate(`/events/${event.id}`)}
          className="flex items-center gap-4 py-4 text-left hover:bg-slate-50 px-2 rounded-lg transition-colors"
        >
          {/* Cover thumbnail or gradient swatch */}
          <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
            {event.coverImageUrl ? (
              <img
                src={resolveMediaUrl(event.coverImageUrl)}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className={[
                  'w-full h-full flex items-center justify-center text-[22px]',
                  `bg-gradient-to-br ${['from-[#1E3A8A] via-[#2563EB] to-[#38BDF8]', 'from-[#4C1D95] via-[#7C3AED] to-[#A78BFA]', 'from-[#064E3B] via-[#059669] to-[#34D399]', 'from-[#78350F] via-[#D97706] to-[#FCD34D]'][event.id % 4]}`,
                ].join(' ')}
              >
                {['🎵', '🎭', '🏆', '🎪'][event.id % 4]}
              </div>
            )}
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-semibold text-slate-900 truncate leading-snug">
              {event.title}
            </p>
            <div className="flex items-center gap-3 mt-1">
              <span className="flex items-center gap-1 text-[12px] text-slate-400">
                <Calendar className="w-3 h-3" />
                {format(parseISO(event.startDate), 'EEE, MMM d, yyyy')}
              </span>
              <span className="flex items-center gap-1 text-[12px] text-slate-400">
                <MapPin className="w-3 h-3" />
                <span className="truncate max-w-[180px]">{event.location}</span>
              </span>
            </div>
          </div>

          {/* Chip badge */}
          <span
            className={[
              'flex-shrink-0 px-2.5 py-1 rounded-full text-[11px] font-semibold',
              chipColor(event.id),
            ].join(' ')}
          >
            Going
          </span>
        </button>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type ViewMode = 'month' | 'list';

export default function GoingPage() {
  const [viewMode, setViewMode]     = useState<ViewMode>('month');
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  const { data: goingEvents, isLoading, isError, error, refetch } = useQuery<EventDto[]>({
    queryKey: ['going'],
    queryFn: fetchGoingEvents,
  });

  const count = goingEvents?.length ?? 0;

  return (
    <main className="max-w-[1300px] mx-auto px-7 py-10">
      {/* Page header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center">
              <CalendarCheck className="w-[18px] h-[18px] text-green-600" />
            </div>
            <h1 className="text-[24px] font-extrabold text-slate-900 tracking-[-0.4px]">
              My Calendar
            </h1>
          </div>

          {/* View tabs */}
          {!isLoading && !isError && count > 0 && (
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
              {(['month', 'list'] as ViewMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={[
                    'px-3.5 py-1.5 rounded-md text-[13px] font-semibold transition-all duration-150',
                    viewMode === mode
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700',
                  ].join(' ')}
                >
                  {mode === 'month' ? 'Month' : 'List'}
                </button>
              ))}
            </div>
          )}
        </div>

        {!isLoading && !isError && (
          <p className="text-[13.5px] text-slate-400 ml-12">
            {count} event{count !== 1 ? 's' : ''} you&apos;re going to
          </p>
        )}
      </div>

      {isLoading && <LoadingSpinner />}

      {isError && (
        <ErrorMessage
          message={(error as Error)?.message ?? 'Failed to load your calendar.'}
          onRetry={() => refetch()}
        />
      )}

      {!isLoading && !isError && count === 0 && (
        <div className="text-center py-24 px-6">
          <div className="w-[72px] h-[72px] rounded-xl bg-green-50 flex items-center justify-center mx-auto mb-5">
            <CalendarCheck className="w-8 h-8 text-green-400" />
          </div>
          <h3 className="text-[18px] font-extrabold text-slate-800 mb-2 tracking-[-0.3px]">
            No events yet
          </h3>
          <p className="text-[14px] text-slate-400 max-w-[280px] mx-auto leading-[1.7]">
            Tap the calendar icon on any event to mark yourself as going.
          </p>
        </div>
      )}

      {!isLoading && !isError && count > 0 && (
        <>
          {viewMode === 'month' && (
            <MonthView
              events={goingEvents!}
              currentMonth={currentMonth}
              onPrev={() => setCurrentMonth((m) => subMonths(m, 1))}
              onNext={() => setCurrentMonth((m) => addMonths(m, 1))}
            />
          )}
          {viewMode === 'list' && <ListView events={goingEvents!} />}
        </>
      )}
    </main>
  );
}
