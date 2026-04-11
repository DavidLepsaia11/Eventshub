// src/components/EventCard.tsx

import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, ArrowRight } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import Badge from './Badge';
import type { EventDto } from '@/types/event';

// Deterministic gradient based on event id so each card feels distinct
const GRADIENTS = [
  'from-[#1E3A8A] via-[#2563EB] to-[#38BDF8]',   // blue / concert
  'from-[#064E3B] via-[#059669] to-[#34D399]',     // green / sports
  'from-[#4C1D95] via-[#7C3AED] to-[#A78BFA]',    // violet / theatre
  'from-[#78350F] via-[#D97706] to-[#FCD34D]',    // amber / festival
  'from-[#831843] via-[#E11D48] to-[#FB7185]',    // rose / art
  'from-[#0C4A6E] via-[#0EA5E9] to-[#7DD3FC]',   // cyan / tech
];

const EMOJIS = ['🎵', '🏆', '🎭', '🎪', '🎨', '💻'];

interface EventCardProps {
  event: EventDto;
}

function formatDateRange(start: string, end: string): string {
  const s = parseISO(start);
  const e = parseISO(end);
  if (format(s, 'yyyy-MM-dd') === format(e, 'yyyy-MM-dd')) {
    return format(s, 'MMM d, yyyy');
  }
  return `${format(s, 'MMM d')} – ${format(e, 'MMM d, yyyy')}`;
}

export default function EventCard({ event }: EventCardProps) {
  const navigate = useNavigate();
  const idx = event.id % GRADIENTS.length;

  return (
    <article
      onClick={() => navigate(`/events/${event.id}`)}
      className="
        bg-white rounded-lg overflow-hidden shadow-sm border border-slate-200
        transition-all duration-[220ms] cursor-pointer relative
        hover:shadow-xl hover:-translate-y-1 hover:border-brand-200
      "
    >
      {/* Cover */}
      <div className="w-full h-[175px] relative overflow-hidden">
        {event.coverImageUrl ? (
          <img
            src={event.coverImageUrl.startsWith('http') ? event.coverImageUrl : `${import.meta.env.VITE_API_URL}${event.coverImageUrl}`}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div
            className={`w-full h-full bg-gradient-to-br ${GRADIENTS[idx]} flex items-center justify-center text-[52px] transition-transform duration-300 hover:scale-105`}
          >
            {EMOJIS[idx]}
          </div>
        )}

        {/* Published badge overlay */}
        <div className="absolute top-3 left-3">
          <Badge variant={event.isPublished ? 'published' : 'draft'} showIcon>
            {event.isPublished ? 'Published' : 'Draft'}
          </Badge>
        </div>
      </div>

      {/* Body */}
      <div className="px-[18px] pt-4 pb-[18px]">
        <h2 className="text-[15px] font-bold text-slate-900 leading-snug mb-2.5 line-clamp-2 tracking-[-0.2px]">
          {event.title}
        </h2>

        <div className="flex flex-col gap-[5px] mb-3.5">
          <div className="flex items-center gap-1.5 text-[12.5px] text-slate-500">
            <Calendar className="w-[13px] h-[13px] text-slate-400 flex-shrink-0" />
            {formatDateRange(event.startDate, event.endDate)}
          </div>
          <div className="flex items-center gap-1.5 text-[12.5px] text-slate-500">
            <MapPin className="w-[13px] h-[13px] text-slate-400 flex-shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <span className="text-[12px] text-slate-400 font-medium">
            Added {format(parseISO(event.createdAt), 'MMM d, yyyy')}
          </span>
          <button
            onClick={(e) => { e.stopPropagation(); navigate(`/events/${event.id}`); }}
            className="
              inline-flex items-center gap-1 text-[12.5px] font-semibold text-brand-600
              hover:text-brand-700 transition-colors
            "
          >
            View Details
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
}
