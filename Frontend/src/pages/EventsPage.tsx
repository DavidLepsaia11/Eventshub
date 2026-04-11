// src/pages/EventsPage.tsx

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, MapPin, Calendar, Zap } from 'lucide-react';
import { fetchEvents } from '@/api/events';
import EventCard from '@/components/EventCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';

export default function EventsPage() {
  const [search, setSearch] = useState('');
  const [filterPublished, setFilterPublished] = useState<'all' | 'published' | 'draft'>('all');

  const { data: events, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['events'],
    queryFn: fetchEvents,
  });

  const filtered = useMemo(() => {
    if (!events) return [];
    return events.filter((e) => {
      const matchesSearch =
        search.trim() === '' ||
        e.title.toLowerCase().includes(search.toLowerCase()) ||
        e.location.toLowerCase().includes(search.toLowerCase());

      const matchesFilter =
        filterPublished === 'all' ||
        (filterPublished === 'published' && e.isPublished) ||
        (filterPublished === 'draft' && !e.isPublished);

      return matchesSearch && matchesFilter;
    });
  }, [events, search, filterPublished]);

  return (
    <main>
      {/* Hero */}
      <section className="bg-slate-900 overflow-hidden relative px-7 py-[72px] pb-20">
        {/* Mesh gradient backdrop */}
        <div
          className="absolute inset-0 opacity-60"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 20% 50%, rgba(37,99,235,0.5) 0%, transparent 60%), radial-gradient(ellipse 60% 80% at 80% 30%, rgba(14,165,233,0.4) 0%, transparent 55%), radial-gradient(ellipse 50% 50% at 60% 80%, rgba(124,58,237,0.3) 0%, transparent 50%)',
          }}
        />

        <div className="max-w-[1300px] mx-auto relative z-10">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-[12.5px] font-semibold text-white/80 mb-[22px] backdrop-blur-sm">
            <Zap className="w-[13px] h-[13px] text-blue-400" />
            Discover Amazing Events
          </div>

          <h1 className="text-[52px] font-black text-white tracking-[-1.5px] leading-[1.12] max-w-[640px] mb-[18px]">
            Find Your Next{' '}
            <span
              style={{
                background: 'linear-gradient(90deg, #60A5FA, #38BDF8, #67E8F9)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Experience
            </span>
          </h1>

          <p className="text-[17px] text-white/60 max-w-[480px] leading-[1.7] mb-9">
            Browse, explore and attend incredible events happening around you.
          </p>

          {/* Search box */}
          <div className="bg-white rounded-lg p-1.5 flex gap-1.5 shadow-[0_20px_60px_rgba(0,0,0,0.2)] border border-white/8 max-w-[660px] mb-[52px]">
            <div className="flex-1 flex items-center gap-2.5 px-3.5 border-r border-slate-200">
              <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search events, keywords…"
                className="flex-1 border-none outline-none text-[14px] font-[inherit] text-slate-700 placeholder:text-slate-400 bg-transparent"
              />
            </div>
            <div className="flex items-center gap-2 px-3.5 text-slate-500 text-[13.5px]">
              <MapPin className="w-[15px] h-[15px] text-slate-400" />
              All locations
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-9">
            <div>
              <div className="text-2xl font-extrabold text-white tracking-[-0.5px]">
                {events?.length ?? '—'}
              </div>
              <div className="text-[12px] text-white/50 mt-0.5">Total Events</div>
            </div>
            <div className="w-px h-9 bg-white/12" />
            <div>
              <div className="text-2xl font-extrabold text-white tracking-[-0.5px]">
                {events?.filter((e) => e.isPublished).length ?? '—'}
              </div>
              <div className="text-[12px] text-white/50 mt-0.5">Published</div>
            </div>
            <div className="w-px h-9 bg-white/12" />
            <div>
              <div className="text-2xl font-extrabold text-white tracking-[-0.5px]">
                {events ? events.filter((e) => !e.isPublished).length : '—'}
              </div>
              <div className="text-[12px] text-white/50 mt-0.5">Drafts</div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-[1300px] mx-auto px-7 py-10">
        {/* Filter chips */}
        <div className="mb-6">
          <p className="text-[11.5px] font-bold uppercase tracking-[0.6px] text-slate-400 mb-3">
            Filter
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            {(['all', 'published', 'draft'] as const).map((f) => {
              const labels = { all: 'All Events', published: 'Published', draft: 'Drafts' };
              const icons = { all: <Calendar className="w-3.5 h-3.5" />, published: <Zap className="w-3.5 h-3.5" />, draft: <Search className="w-3.5 h-3.5" /> };
              const active = filterPublished === f;
              return (
                <button
                  key={f}
                  onClick={() => setFilterPublished(f)}
                  className={[
                    'inline-flex items-center gap-1.5 px-4 py-2 rounded-full border-[1.5px] text-[13px] font-semibold cursor-pointer transition-all duration-[160ms] shadow-xs',
                    active
                      ? 'bg-brand-600 text-white border-brand-600 shadow-brand'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-brand-200 hover:text-brand-600 hover:bg-brand-50',
                  ].join(' ')}
                >
                  {icons[f]}
                  {labels[f]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section header */}
        <div className="mb-[22px]">
          <h2 className="text-[19px] font-extrabold text-slate-900 tracking-[-0.3px]">
            {filterPublished === 'all'
              ? 'All Events'
              : filterPublished === 'published'
              ? 'Published Events'
              : 'Draft Events'}
          </h2>
          {!isLoading && !isError && (
            <p className="text-[13px] text-slate-400 mt-0.5">
              {filtered.length} event{filtered.length !== 1 ? 's' : ''} found
              {search.trim() !== '' && ` for "${search}"`}
            </p>
          )}
        </div>

        {/* States */}
        {isLoading && <LoadingSpinner />}

        {isError && (
          <ErrorMessage
            message={(error as Error)?.message ?? 'Failed to load events.'}
            onRetry={() => refetch()}
          />
        )}

        {!isLoading && !isError && filtered.length === 0 && (
          <div className="text-center py-20 px-6">
            <div className="w-[72px] h-[72px] rounded-xl bg-brand-50 flex items-center justify-center mx-auto mb-5">
              <Calendar className="w-8 h-8 text-brand-600" />
            </div>
            <h3 className="text-[18px] font-extrabold text-slate-800 mb-2 tracking-[-0.3px]">
              No events found
            </h3>
            <p className="text-[14px] text-slate-400 max-w-[300px] mx-auto leading-[1.7]">
              {search.trim() !== ''
                ? `No events match "${search}". Try a different keyword.`
                : 'No events available yet. Check back soon!'}
            </p>
          </div>
        )}

        {!isLoading && !isError && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[22px]">
            {filtered.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
