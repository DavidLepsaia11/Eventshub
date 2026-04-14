// src/pages/EventsPage.tsx
// Explore view  → guests and visitors (published events only, category filter)
// Admin view    → admins (all events with published/draft filter)

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Search, MapPin, Calendar, Zap, Sparkles,
  Music2, Trophy, Drama, Tent, Palette, Cpu,
  UtensilsCrossed, Laugh, Briefcase, HeartPulse,
  type LucideIcon,
} from 'lucide-react';
import { fetchEvents, fetchCategories } from '@/api/events';
import { useAuth } from '@/context/AuthContext';
import EventCard from '@/components/EventCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import type { CategoryDto } from '@/types/event';

// ─── Category icon mapping ────────────────────────────────────────────────────

function getCategoryIcon(name: string): LucideIcon {
  const n = name.toLowerCase();
  if (n.includes('concert') || n.includes('music'))        return Music2;
  if (n.includes('sport') || n.includes('football'))       return Trophy;
  if (n.includes('theat') || n.includes('drama'))          return Drama;
  if (n.includes('festival') || n.includes('fair'))        return Tent;
  if (n.includes('art') || n.includes('culture'))          return Palette;
  if (n.includes('tech') || n.includes('developer'))       return Cpu;
  if (n.includes('food') || n.includes('drink'))           return UtensilsCrossed;
  if (n.includes('comedy') || n.includes('stand-up'))      return Laugh;
  if (n.includes('business') || n.includes('conference'))  return Briefcase;
  if (n.includes('health') || n.includes('wellness'))      return HeartPulse;
  return Calendar;
}

// ─── Explore view (guests & visitors) ────────────────────────────────────────

function ExploreView() {
  const [search, setSearch]             = useState('');
  const [activeCatId, setActiveCatId]   = useState<number | null>(null);

  const {
    data: events, isLoading: eventsLoading, isError: eventsError, error: eventsErr, refetch,
  } = useQuery({ queryKey: ['events'], queryFn: fetchEvents });

  const {
    data: categories = [], isLoading: catsLoading,
  } = useQuery({ queryKey: ['categories'], queryFn: fetchCategories });

  const published = useMemo(() => (events ?? []).filter((e) => e.isPublished), [events]);

  const filtered = useMemo(() => {
    return published
      .filter((e) => {
        const q = search.trim().toLowerCase();
        return q === '' || e.title.toLowerCase().includes(q) || e.location.toLowerCase().includes(q);
      })
      .filter((e) => activeCatId === null || e.categoryId === activeCatId)
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  }, [published, search, activeCatId]);

  return (
    <main>
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="bg-slate-900 overflow-hidden relative px-7 py-[44px] pb-12">
        <div
          className="absolute inset-0 opacity-60 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 20% 50%,rgba(37,99,235,.5) 0%,transparent 60%),' +
              'radial-gradient(ellipse 60% 80% at 80% 30%,rgba(14,165,233,.4) 0%,transparent 55%),' +
              'radial-gradient(ellipse 50% 50% at 60% 80%,rgba(124,58,237,.3) 0%,transparent 50%)',
          }}
        />
        <div className="max-w-[1300px] mx-auto relative z-10">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-[12.5px] font-semibold text-white/80 mb-[22px] backdrop-blur-sm">
            <Zap className="w-[13px] h-[13px] text-blue-400" />
            {published.length > 0 ? `${published.length} events happening` : 'Discover amazing events'}
          </div>

          <h1 className="text-[52px] font-black text-white tracking-[-1.5px] leading-[1.12] max-w-[640px] mb-[18px]">
            Discover{' '}
            <span style={{ background: 'linear-gradient(90deg,#60A5FA,#38BDF8,#67E8F9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Unforgettable
            </span>
            <br />Events Near You
          </h1>

          <p className="text-[17px] text-white/60 max-w-[480px] leading-[1.7] mb-9">
            From world-class concerts to local festivals — find, save and RSVP to events that move you.
          </p>

          {/* Search bar */}
          <div className="bg-white rounded-lg p-1.5 flex gap-1.5 shadow-[0_20px_60px_rgba(0,0,0,.2)] border border-white/8 max-w-[660px] mb-[52px]">
            <div className="flex-1 flex items-center gap-2.5 px-3.5 border-r border-slate-200">
              <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search events, artists, venues…"
                className="flex-1 border-none outline-none text-[14px] font-[inherit] text-slate-700 placeholder:text-slate-400 bg-transparent"
              />
            </div>
            <div className="flex items-center gap-2 px-3.5 text-slate-500 text-[13.5px]">
              <MapPin className="w-[15px] h-[15px] text-slate-400" />
              All locations
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-[13.5px] font-semibold rounded-[8px] transition-colors flex-shrink-0">
              <Search className="w-[14px] h-[14px]" />
              Search
            </button>
          </div>

        </div>
      </section>

      {/* ── Content ───────────────────────────────────────────── */}
      <section className="max-w-[1300px] mx-auto px-7 py-10">

        {/* Category filter chips */}
        {!catsLoading && categories.length > 0 && (
          <div className="mb-8">
            <p className="text-[11.5px] font-bold uppercase tracking-[0.6px] text-slate-400 mb-3">
              Browse by Category
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              {/* All */}
              <button
                onClick={() => setActiveCatId(null)}
                className={[
                  'inline-flex items-center gap-1.5 px-4 py-2 rounded-full border-[1.5px] text-[13px] font-semibold cursor-pointer transition-all duration-[160ms] shadow-xs',
                  activeCatId === null
                    ? 'bg-brand-600 text-white border-brand-600 shadow-brand'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-brand-200 hover:text-brand-600 hover:bg-brand-50',
                ].join(' ')}
              >
                <Sparkles className="w-3.5 h-3.5" />
                All Events
              </button>

              {/* Dynamic categories from API */}
              {categories.map((cat: CategoryDto) => {
                const Icon = getCategoryIcon(cat.name);
                const active = activeCatId === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCatId(active ? null : cat.id)}
                    className={[
                      'inline-flex items-center gap-1.5 px-4 py-2 rounded-full border-[1.5px] text-[13px] font-semibold cursor-pointer transition-all duration-[160ms] shadow-xs',
                      active
                        ? 'bg-brand-600 text-white border-brand-600 shadow-brand'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-brand-200 hover:text-brand-600 hover:bg-brand-50',
                    ].join(' ')}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Section header */}
        <div className="mb-[22px]">
          <h2 className="text-[19px] font-extrabold text-slate-900 tracking-[-0.3px]">
            Upcoming Events
          </h2>
          {!eventsLoading && !eventsError && (
            <p className="text-[13px] text-slate-400 mt-0.5">
              {filtered.length} event{filtered.length !== 1 ? 's' : ''} found
              {search.trim() !== '' && ` for "${search}"`}
              {activeCatId !== null && ` in ${categories.find((c) => c.id === activeCatId)?.name ?? 'this category'}`}
              {' · sorted by date'}
            </p>
          )}
        </div>

        {/* States */}
        {eventsLoading && <LoadingSpinner />}

        {eventsError && (
          <ErrorMessage
            message={(eventsErr as Error)?.message ?? 'Failed to load events.'}
            onRetry={() => refetch()}
          />
        )}

        {!eventsLoading && !eventsError && filtered.length === 0 && (
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
                : 'No upcoming events in this category. Check back soon!'}
            </p>
          </div>
        )}

        {!eventsLoading && !eventsError && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[22px]">
            {filtered.map((event) => (
              <EventCard key={event.id} event={event} showStatus={false} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

// ─── Admin view ───────────────────────────────────────────────────────────────

function AdminView() {
  const [search, setSearch]             = useState('');
  const [filterPublished, setFilterPublished] = useState<'all' | 'published' | 'draft'>('all');

  const { data: events, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['events'],
    queryFn: fetchEvents,
  });

  const filtered = useMemo(() => {
    if (!events) return [];
    return events.filter((e) => {
      const matchSearch =
        search.trim() === '' ||
        e.title.toLowerCase().includes(search.toLowerCase()) ||
        e.location.toLowerCase().includes(search.toLowerCase());
      const matchFilter =
        filterPublished === 'all' ||
        (filterPublished === 'published' && e.isPublished) ||
        (filterPublished === 'draft' && !e.isPublished);
      return matchSearch && matchFilter;
    });
  }, [events, search, filterPublished]);

  return (
    <main>
      {/* Hero */}
      <section className="bg-slate-900 overflow-hidden relative px-7 py-[44px] pb-12">
        <div
          className="absolute inset-0 opacity-60 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 20% 50%,rgba(37,99,235,.5) 0%,transparent 60%),' +
              'radial-gradient(ellipse 60% 80% at 80% 30%,rgba(14,165,233,.4) 0%,transparent 55%),' +
              'radial-gradient(ellipse 50% 50% at 60% 80%,rgba(124,58,237,.3) 0%,transparent 50%)',
          }}
        />
        <div className="max-w-[1300px] mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-[12.5px] font-semibold text-white/80 mb-[22px] backdrop-blur-sm">
            <Zap className="w-[13px] h-[13px] text-blue-400" />
            All Events
          </div>
          <h1 className="text-[52px] font-black text-white tracking-[-1.5px] leading-[1.12] max-w-[640px] mb-[18px]">
            Find Your Next{' '}
            <span style={{ background: 'linear-gradient(90deg,#60A5FA,#38BDF8,#67E8F9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Experience
            </span>
          </h1>
          <p className="text-[17px] text-white/60 max-w-[480px] leading-[1.7] mb-9">
            Browse, explore and attend incredible events happening around you.
          </p>
          {/* Search */}
          <div className="bg-white rounded-lg p-1.5 flex gap-1.5 shadow-[0_20px_60px_rgba(0,0,0,.2)] border border-white/8 max-w-[660px] mb-[52px]">
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
          </div>
      </section>

      {/* Content */}
      <section className="max-w-[1300px] mx-auto px-7 py-10">
        {/* Filter chips */}
        <div className="mb-6">
          <p className="text-[11.5px] font-bold uppercase tracking-[0.6px] text-slate-400 mb-3">Filter</p>
          <div className="flex items-center gap-2 flex-wrap">
            {(['all', 'published', 'draft'] as const).map((f) => {
              const labels  = { all: 'All Events', published: 'Published', draft: 'Drafts' };
              const active  = filterPublished === f;
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
                  {labels[f]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section header */}
        <div className="mb-[22px]">
          <h2 className="text-[19px] font-extrabold text-slate-900 tracking-[-0.3px]">
            {filterPublished === 'all' ? 'All Events' : filterPublished === 'published' ? 'Published Events' : 'Draft Events'}
          </h2>
          {!isLoading && !isError && (
            <p className="text-[13px] text-slate-400 mt-0.5">
              {filtered.length} event{filtered.length !== 1 ? 's' : ''} found
              {search.trim() !== '' && ` for "${search}"`}
            </p>
          )}
        </div>

        {isLoading && <LoadingSpinner />}
        {isError  && <ErrorMessage message={(error as Error)?.message ?? 'Failed to load events.'} onRetry={() => refetch()} />}

        {!isLoading && !isError && filtered.length === 0 && (
          <div className="text-center py-20 px-6">
            <div className="w-[72px] h-[72px] rounded-xl bg-brand-50 flex items-center justify-center mx-auto mb-5">
              <Calendar className="w-8 h-8 text-brand-600" />
            </div>
            <h3 className="text-[18px] font-extrabold text-slate-800 mb-2 tracking-[-0.3px]">No events found</h3>
            <p className="text-[14px] text-slate-400 max-w-[300px] mx-auto leading-[1.7]">
              {search.trim() !== '' ? `No events match "${search}".` : 'No events available yet.'}
            </p>
          </div>
        )}

        {!isLoading && !isError && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[22px]">
            {filtered.map((event) => (
              <EventCard key={event.id} event={event} showStatus={true} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

// ─── Page entry ───────────────────────────────────────────────────────────────

export default function EventsPage() {
  const { isAdmin } = useAuth();
  return isAdmin ? <AdminView /> : <ExploreView />;
}
