// src/pages/FavouritesPage.tsx
// Visitor-only page — shows events the current user has favourited.

import { useState, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Heart } from 'lucide-react';
import { fetchFavourites, toggleFavourite } from '@/api/favourites';
import EventCard from '@/components/EventCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';

export default function FavouritesPage() {
  const queryClient = useQueryClient();
  const { data: favourites, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['favourites'],
    queryFn: fetchFavourites,
  });

  // Optimistic overlay for in-flight toggle calls. Removing from favourites on this page
  // means the card should disappear; we hide it by removing from the visible set immediately.
  const [optimisticOverrides, setOptimisticOverrides] = useState<Map<number, boolean>>(new Map());

  // Base favourite set derived directly from server data — no useState copy, no useEffect lag.
  const serverFavIds = useMemo<Set<number>>(
    () => new Set((favourites ?? []).map((f) => f.id)),
    [favourites],
  );

  function isFavourited(eventId: number): boolean {
    if (optimisticOverrides.has(eventId)) return optimisticOverrides.get(eventId)!;
    return serverFavIds.has(eventId);
  }

  async function handleToggleFavourite(eventId: number, newState: boolean) {
    setOptimisticOverrides((prev) => new Map(prev).set(eventId, newState));
    try {
      await toggleFavourite(eventId);
      // Refresh all relevant queries, then drop the override — the card will disappear as the
      // favourites list no longer contains this event.
      await queryClient.invalidateQueries({ queryKey: ['favourites'] });
      await queryClient.invalidateQueries({ queryKey: ['events'] });
      await queryClient.invalidateQueries({ queryKey: ['going'] });
      setOptimisticOverrides((prev) => {
        const next = new Map(prev);
        next.delete(eventId);
        return next;
      });
    } catch {
      // Revert optimistic change on failure.
      setOptimisticOverrides((prev) => {
        const next = new Map(prev);
        next.delete(eventId);
        return next;
      });
    }
  }

  // Only show events that are still favourited (hides optimistically-removed cards immediately).
  const visible = (favourites ?? []).filter((e) => isFavourited(e.id));

  return (
    <main className="max-w-[1300px] mx-auto px-7 py-10">
      {/* Page header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center">
            <Heart className="w-[18px] h-[18px] text-red-500 fill-red-500" />
          </div>
          <h1 className="text-[24px] font-extrabold text-slate-900 tracking-[-0.4px]">
            My Favourites
          </h1>
        </div>
        {!isLoading && !isError && (
          <p className="text-[13.5px] text-slate-400 ml-12">
            {visible.length} saved event{visible.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {isLoading && <LoadingSpinner />}

      {isError && (
        <ErrorMessage
          message={(error as Error)?.message ?? 'Failed to load favourites.'}
          onRetry={() => refetch()}
        />
      )}

      {!isLoading && !isError && visible.length === 0 && (
        <div className="text-center py-24 px-6">
          <div className="w-[72px] h-[72px] rounded-xl bg-red-50 flex items-center justify-center mx-auto mb-5">
            <Heart className="w-8 h-8 text-red-400" />
          </div>
          <h3 className="text-[18px] font-extrabold text-slate-800 mb-2 tracking-[-0.3px]">
            No favourites yet
          </h3>
          <p className="text-[14px] text-slate-400 max-w-[280px] mx-auto leading-[1.7]">
            Tap the heart icon on any event to save it here for quick access.
          </p>
        </div>
      )}

      {!isLoading && !isError && visible.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[22px]">
          {visible.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              showStatus={false}
              isFavourited={isFavourited(event.id)}
              onToggleFavourite={handleToggleFavourite}
            />
          ))}
        </div>
      )}
    </main>
  );
}
