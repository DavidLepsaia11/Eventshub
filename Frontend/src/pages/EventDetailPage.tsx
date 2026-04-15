// src/pages/EventDetailPage.tsx

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchEvent } from '@/api/events';
import { toggleFavourite } from '@/api/favourites';
import { toggleAttendance } from '@/api/attendance';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import Badge from '@/components/Badge';
import { MapPin, Calendar, Clock, ChevronRight, Edit, ArrowLeft, Heart, CalendarCheck } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { useAuth } from '@/context/AuthContext';

const GRADIENTS = [
  'from-[#1E3A8A] via-[#2563EB] to-[#38BDF8]',
  'from-[#064E3B] via-[#059669] to-[#34D399]',
  'from-[#4C1D95] via-[#7C3AED] to-[#A78BFA]',
  'from-[#78350F] via-[#D97706] to-[#FCD34D]',
  'from-[#831843] via-[#E11D48] to-[#FB7185]',
  'from-[#0C4A6E] via-[#0EA5E9] to-[#7DD3FC]',
];
const EMOJIS = ['🎵', '🏆', '🎭', '🎪', '🎨', '💻'];

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAdmin, isVisitor } = useAuth();
  const queryClient = useQueryClient();
  const eventId = Number(id);

  const { data: event, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['event', eventId],
    queryFn: () => fetchEvent(eventId),
    enabled: !isNaN(eventId),
  });

  // Optimistic states for this page's toggle buttons
  const [favOverride,   setFavOverride]   = useState<boolean | null>(null);
  const [goingOverride, setGoingOverride] = useState<boolean | null>(null);

  const isFavourited = favOverride   !== null ? favOverride   : (event?.isFavourited ?? false);
  const isGoing      = goingOverride !== null ? goingOverride : (event?.isGoing      ?? false);

  async function handleToggleFavourite() {
    const next = !isFavourited;
    setFavOverride(next);
    try {
      await toggleFavourite(eventId);
      await queryClient.invalidateQueries({ queryKey: ['event', eventId] });
      await queryClient.invalidateQueries({ queryKey: ['events'] });
      await queryClient.invalidateQueries({ queryKey: ['favourites'] });
    } catch {
      setFavOverride(null); // revert
    } finally {
      setFavOverride(null); // let server truth take over after refetch
    }
  }

  async function handleToggleGoing() {
    const next = !isGoing;
    setGoingOverride(next);
    try {
      await toggleAttendance(eventId);
      await queryClient.invalidateQueries({ queryKey: ['event', eventId] });
      await queryClient.invalidateQueries({ queryKey: ['events'] });
      await queryClient.invalidateQueries({ queryKey: ['going'] });
    } catch {
      setGoingOverride(null); // revert
    } finally {
      setGoingOverride(null); // let server truth take over after refetch
    }
  }

  if (isLoading) return <LoadingSpinner fullPage />;

  if (isError || !event) {
    return (
      <div className="max-w-[1300px] mx-auto px-7 py-10">
        <ErrorMessage
          message={(error as Error)?.message ?? 'Event not found.'}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const idx = event.id % GRADIENTS.length;

  return (
    <main className="max-w-[1300px] mx-auto px-7 py-10 pb-20">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-[13px] text-slate-400 mb-6">
        <button
          onClick={() => navigate('/')}
          className="hover:text-brand-600 transition-colors cursor-pointer"
        >
          Events
        </button>
        <ChevronRight className="w-[13px] h-[13px] text-slate-300" />
        <span className="text-slate-600 font-medium truncate max-w-[300px]">{event.title}</span>
      </nav>

      {/* Cover hero */}
      <div className={`w-full h-[380px] rounded-xl overflow-hidden mb-9 flex items-center justify-center text-[100px] relative ${event.coverImageUrl ? 'bg-black' : `bg-gradient-to-br ${GRADIENTS[idx]}`}`}>
        {event.coverImageUrl ? (
          <img
            src={event.coverImageUrl!.startsWith('http') ? event.coverImageUrl! : `${import.meta.env.VITE_API_URL}${event.coverImageUrl}`}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          EMOJIS[idx]
        )}
        {/* overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-5 left-7 right-7 flex items-end justify-between">
          {isAdmin && (
            <Badge variant={event.isPublished ? 'published' : 'draft'} showIcon>
              {event.isPublished ? 'Published' : 'Draft'}
            </Badge>
          )}
          {isAdmin && (
            <button
              onClick={() => navigate(`/admin/events/${event.id}/edit`)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xs bg-white/20 backdrop-blur-sm border border-white/25 text-white text-[13px] font-semibold hover:bg-white/30 transition-colors"
            >
              <Edit className="w-[14px] h-[14px]" />
              Edit Event
            </button>
          )}
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-9 items-start">
        {/* Main content */}
        <div>
          <h1 className="text-[30px] font-black text-slate-900 tracking-[-0.6px] leading-[1.25] mb-3.5">
            {event.title}
          </h1>

          {/* Meta strip */}
          <div className="flex flex-col gap-3 mb-7 p-5 bg-slate-50 rounded-md border border-slate-200">
            <div className="flex items-center gap-3 text-[14px] text-slate-600">
              <Calendar
                className="w-[17px] h-[17px] text-brand-600 bg-brand-50 p-[3px] rounded-xs flex-shrink-0"
                style={{ padding: '3px' }}
              />
              <span>
                {format(parseISO(event.startDate), 'MMMM d, yyyy — h:mm a')}
              </span>
            </div>
            <div className="flex items-center gap-3 text-[14px] text-slate-600">
              <Clock
                className="w-[17px] h-[17px] text-brand-600 bg-brand-50 p-[3px] rounded-xs flex-shrink-0"
                style={{ padding: '3px' }}
              />
              <span>
                Ends {format(parseISO(event.endDate), 'MMMM d, yyyy — h:mm a')}
              </span>
            </div>
            <div className="flex items-center gap-3 text-[14px] text-slate-600">
              <MapPin
                className="w-[17px] h-[17px] text-brand-600 bg-brand-50 p-[3px] rounded-xs flex-shrink-0"
                style={{ padding: '3px' }}
              />
              <span>{event.location}</span>
            </div>
          </div>

          {/* Description */}
          {event.description ? (
            <div className="text-[15px] leading-[1.8] text-slate-600 whitespace-pre-line">
              {event.description}
            </div>
          ) : (
            <p className="text-[14px] text-slate-400 italic">No description provided.</p>
          )}
        </div>

        {/* Sticky sidebar info card */}
        <aside className="bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden sticky top-[78px]">
          <div className="px-5 py-[18px] border-b border-slate-100 bg-gradient-to-r from-brand-50 to-white">
            <h3 className="text-[14px] font-bold text-slate-800">Event Details</h3>
          </div>
          <div className="p-5">
            {/* Date row */}
            <div className="flex items-start gap-3.5 py-3 border-b border-slate-100">
              <div className="w-[34px] h-[34px] rounded-xs bg-brand-50 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-4 h-4 text-brand-600" />
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-[0.4px] mb-0.5">
                  Date
                </p>
                <p className="text-[13.5px] font-semibold text-slate-800">
                  {format(parseISO(event.startDate), 'MMM d, yyyy')}
                </p>
              </div>
            </div>

            {/* Time row */}
            <div className="flex items-start gap-3.5 py-3 border-b border-slate-100">
              <div className="w-[34px] h-[34px] rounded-xs bg-brand-50 flex items-center justify-center flex-shrink-0">
                <Clock className="w-4 h-4 text-brand-600" />
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-[0.4px] mb-0.5">
                  Time
                </p>
                <p className="text-[13.5px] font-semibold text-slate-800">
                  {format(parseISO(event.startDate), 'h:mm a')} –{' '}
                  {format(parseISO(event.endDate), 'h:mm a')}
                </p>
              </div>
            </div>

            {/* Location row */}
            <div className="flex items-start gap-3.5 py-3 border-b border-slate-100">
              <div className="w-[34px] h-[34px] rounded-xs bg-brand-50 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-4 h-4 text-brand-600" />
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-[0.4px] mb-0.5">
                  Location
                </p>
                <p className="text-[13.5px] font-semibold text-slate-800">{event.location}</p>
              </div>
            </div>

            {/* Status row — admins see publish status, visitors see favourite/going toggles */}
            {isAdmin ? (
              <div className="flex items-start gap-3.5 py-3">
                <div className="w-[34px] h-[34px] rounded-xs bg-brand-50 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-4 h-4 text-brand-600" />
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-[0.4px] mb-0.5">
                    Status
                  </p>
                  <Badge variant={event.isPublished ? 'published' : 'draft'} showIcon>
                    {event.isPublished ? 'Published' : 'Draft'}
                  </Badge>
                </div>
              </div>
            ) : isVisitor ? (
              <div className="flex flex-col gap-2.5 py-3">
                <button
                  onClick={handleToggleFavourite}
                  className={[
                    'w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-sm border text-[13.5px] font-semibold transition-all',
                    isFavourited
                      ? 'bg-red-50 border-red-300 text-red-600 hover:bg-red-100'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50',
                  ].join(' ')}
                >
                  <Heart className={`w-[15px] h-[15px] ${isFavourited ? 'fill-red-500 text-red-500' : ''}`} />
                  {isFavourited ? 'Saved to Favourites' : 'Save to Favourites'}
                </button>
                <button
                  onClick={handleToggleGoing}
                  className={[
                    'w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-sm border text-[13.5px] font-semibold transition-all',
                    isGoing
                      ? 'bg-green-50 border-green-300 text-green-600 hover:bg-green-100'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50',
                  ].join(' ')}
                >
                  <CalendarCheck className="w-[15px] h-[15px]" />
                  {isGoing ? 'Going ✓' : "I'm Going"}
                </button>
              </div>
            ) : null}
          </div>

          {/* Actions */}
          <div className="px-5 pb-5 flex flex-col gap-2.5">
            {isAdmin && (
              <button
                onClick={() => navigate(`/admin/events/${event.id}/edit`)}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-sm bg-brand-600 text-white text-[14px] font-semibold hover:bg-brand-700 hover:-translate-y-px transition-all shadow-brand"
              >
                <Edit className="w-[15px] h-[15px]" />
                Edit Event
              </button>
            )}
            <button
              onClick={() => navigate('/')}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xs border border-slate-200 bg-white text-[14px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
            >
              <ArrowLeft className="w-[15px] h-[15px]" />
              Back to Events
            </button>
          </div>
        </aside>
      </div>
    </main>
  );
}
