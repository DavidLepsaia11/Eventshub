// src/components/EventCard.tsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Heart, CalendarCheck, Music2, Trophy, Drama, Tent, Palette, Cpu, UtensilsCrossed, Laugh, Briefcase, HeartPulse, type LucideIcon } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import Badge from './Badge';
import { useAuth } from '@/context/AuthContext';
import { resolveMediaUrl } from '@/api/events';
import type { EventDto } from '@/types/event';

type BadgeVariant = 'published' | 'draft' | 'brand' | 'amber' | 'red' | 'violet' | 'cyan' | 'slate' | 'green';

// ─── Category metadata ───────────────────────────────────────────────────────

interface CategoryMeta {
  gradient: string;
  emoji: string;
  icon: LucideIcon;
  badge: BadgeVariant;
}

const DEFAULT_GRADIENTS = [
  'from-[#1E3A8A] via-[#2563EB] to-[#38BDF8]',
  'from-[#064E3B] via-[#059669] to-[#34D399]',
  'from-[#4C1D95] via-[#7C3AED] to-[#A78BFA]',
  'from-[#78350F] via-[#D97706] to-[#FCD34D]',
  'from-[#831843] via-[#E11D48] to-[#FB7185]',
  'from-[#0C4A6E] via-[#0EA5E9] to-[#7DD3FC]',
];

const CATEGORY_MAP: Array<{ keys: string[]; meta: CategoryMeta }> = [
  { keys: ['concert', 'music'],          meta: { gradient: DEFAULT_GRADIENTS[0], emoji: '🎵', icon: Music2,         badge: 'brand'  } },
  { keys: ['sport', 'football', 'match'],meta: { gradient: DEFAULT_GRADIENTS[1], emoji: '🏆', icon: Trophy,         badge: 'green'  } },
  { keys: ['theat', 'drama', 'musical'], meta: { gradient: DEFAULT_GRADIENTS[2], emoji: '🎭', icon: Drama,          badge: 'violet' } },
  { keys: ['festival', 'fair'],          meta: { gradient: DEFAULT_GRADIENTS[3], emoji: '🎪', icon: Tent,           badge: 'amber'  } },
  { keys: ['art', 'culture', 'exhibit'], meta: { gradient: DEFAULT_GRADIENTS[4], emoji: '🎨', icon: Palette,        badge: 'red'    } },
  { keys: ['tech', 'developer', 'code'], meta: { gradient: DEFAULT_GRADIENTS[5], emoji: '💻', icon: Cpu,            badge: 'cyan'   } },
  { keys: ['food', 'drink', 'culinary'], meta: { gradient: DEFAULT_GRADIENTS[3], emoji: '🍽️', icon: UtensilsCrossed, badge: 'amber'  } },
  { keys: ['comedy', 'stand-up', 'humor'],meta:{ gradient: DEFAULT_GRADIENTS[0], emoji: '😂', icon: Laugh,          badge: 'brand'  } },
  { keys: ['business', 'conference'],    meta: { gradient: DEFAULT_GRADIENTS[5], emoji: '💼', icon: Briefcase,      badge: 'cyan'   } },
  { keys: ['health', 'wellness', 'fit'], meta: { gradient: DEFAULT_GRADIENTS[1], emoji: '🏃', icon: HeartPulse,     badge: 'green'  } },
];

function getCategoryMeta(categoryName: string | null | undefined, fallbackIdx: number): CategoryMeta {
  if (categoryName) {
    const n = categoryName.toLowerCase();
    for (const { keys, meta } of CATEGORY_MAP) {
      if (keys.some((k) => n.includes(k))) return meta;
    }
  }
  return {
    gradient: DEFAULT_GRADIENTS[fallbackIdx % DEFAULT_GRADIENTS.length],
    emoji: ['🎵','🏆','🎭','🎪','🎨','💻'][fallbackIdx % 6],
    icon: Calendar,
    badge: 'brand',
  };
}

// ─── Component ───────────────────────────────────────────────────────────────

interface EventCardProps {
  event: EventDto;
  /** true → show Published/Draft status badge (admin view)
   *  false (default) → show category badge (explore view) */
  showStatus?: boolean;
  /** initial favourite state — passed from parent which owns the fav set */
  isFavourited?: boolean;
  /** called after optimistic toggle so parent can sync its set */
  onToggleFavourite?: (eventId: number, newState: boolean) => void;
  /** initial going state — passed from parent which owns the going set */
  isGoing?: boolean;
  /** called after optimistic toggle so parent can sync its set; only provide for visitor context */
  onToggleGoing?: (eventId: number, newState: boolean) => void;
}

function formatDateRange(start: string, end: string): string {
  const s = parseISO(start);
  const e = parseISO(end);
  if (format(s, 'yyyy-MM-dd') === format(e, 'yyyy-MM-dd')) {
    return format(s, 'EEE, MMM d, yyyy · HH:mm');
  }
  return `${format(s, 'MMM d')} – ${format(e, 'MMM d, yyyy')}`;
}

export default function EventCard({ event, showStatus = false, isFavourited = false, onToggleFavourite, isGoing = false, onToggleGoing }: EventCardProps) {
  const navigate = useNavigate();
  const { isVisitor } = useAuth();
  const meta = getCategoryMeta(event.category?.name, event.id);
  const CategoryIcon = meta.icon;

  // No local copy of isFavourited/isGoing — the parent owns the canonical state.
  // Using useState() would capture the initial (often false) value
  // and never update when the prop changes after the query resolves.
  const [togglingFav, setTogglingFav] = useState(false);
  const [togglingGoing, setTogglingGoing] = useState(false);

  async function handleHeartClick(e: React.MouseEvent) {
    e.stopPropagation();
    if (togglingFav) return;
    const next = !isFavourited;
    setTogglingFav(true);
    try {
      onToggleFavourite?.(event.id, next);
    } finally {
      setTogglingFav(false);
    }
  }

  async function handleGoingClick(e: React.MouseEvent) {
    e.stopPropagation();
    if (togglingGoing) return;
    const next = !isGoing;
    setTogglingGoing(true);
    try {
      onToggleGoing?.(event.id, next);
    } finally {
      setTogglingGoing(false);
    }
  }

  return (
    <article
      onClick={() => navigate(`/events/${event.id}`)}
      className="bg-white rounded-lg overflow-hidden shadow-sm border border-slate-200 transition-all duration-[220ms] cursor-pointer hover:shadow-xl hover:-translate-y-1 hover:border-brand-200"
    >
      {/* Cover */}
      <div className="w-full h-[175px] relative overflow-hidden">
        {event.coverImageUrl ? (
          <img
            src={resolveMediaUrl(event.coverImageUrl)}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${meta.gradient} flex items-center justify-center text-[52px] transition-transform duration-300`}>
            {meta.emoji}
          </div>
        )}

        {/* Cover badge */}
        <div className="absolute top-3 left-3">
          {showStatus ? (
            <Badge variant={event.isPublished ? 'published' : 'draft'} showIcon>
              {event.isPublished ? 'Published' : 'Draft'}
            </Badge>
          ) : (
            event.category && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11.5px] font-semibold backdrop-blur-sm bg-white/20 border border-white/25 text-white">
                <CategoryIcon className="w-3 h-3" />
                {event.category.name}
              </span>
            )
          )}
        </div>

        {/* Action buttons — Visitors only */}
        {isVisitor && (
          <div className="absolute top-[10px] right-[10px] flex items-center gap-1.5">
            {/* Going button — only when parent provides the handler */}
            {onToggleGoing && (
              <button
                onClick={handleGoingClick}
                disabled={togglingGoing}
                className={[
                  'w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-150',
                  isGoing
                    ? 'bg-green-500 border-green-500 text-white'
                    : 'bg-white/20 backdrop-blur-sm border-white/25 text-white hover:bg-white/35',
                ].join(' ')}
              >
                <CalendarCheck className="w-[14px] h-[14px]" />
              </button>
            )}

            {/* Heart / favourite button */}
            <button
              onClick={handleHeartClick}
              disabled={togglingFav}
              className={[
                'w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-150',
                isFavourited
                  ? 'bg-red-500 border-red-500 text-white'
                  : 'bg-white/20 backdrop-blur-sm border-white/25 text-white hover:bg-white/35',
              ].join(' ')}
            >
              <Heart className={`w-[14px] h-[14px] ${isFavourited ? 'fill-white' : ''}`} />
            </button>
          </div>
        )}
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
          {showStatus ? (
            <span className="text-[12px] text-slate-400 font-medium">
              Added {format(parseISO(event.createdAt), 'MMM d, yyyy')}
            </span>
          ) : (
            <span className="text-[12px] text-slate-400 font-medium">
              {format(parseISO(event.startDate), 'MMM d, yyyy')}
            </span>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); navigate(`/events/${event.id}`); }}
            className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-brand-600 hover:text-brand-700 transition-colors"
          >
            View Details
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>
    </article>
  );
}
