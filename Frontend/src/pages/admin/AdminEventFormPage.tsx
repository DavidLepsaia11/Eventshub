// src/pages/admin/AdminEventFormPage.tsx
// Create mode: /admin/events/new
// Edit mode:   /admin/events/:id/edit

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchEvent, createEvent, updateEvent } from '@/api/events';
import EventForm, { type EventFormValues } from '@/components/EventForm';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import PageHeader from '@/components/PageHeader';
import { ChevronRight, AlertCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';

// Converts ISO string "2025-06-15T09:00:00" → datetime-local value "2025-06-15T09:00"
function toDatetimeLocal(iso: string): string {
  try {
    return format(parseISO(iso), "yyyy-MM-dd'T'HH:mm");
  } catch {
    return iso;
  }
}

export default function AdminEventFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditMode = id !== undefined;
  const eventId = Number(id);

  // Error banner state (separate from React Query so we can show mutation errors)
  const [submitError, setSubmitError] = useState<string | null>(null);

  // ── Fetch existing event in edit mode ──────────────────────────────────────
  const {
    data: existingEvent,
    isLoading: isFetchLoading,
    isError: isFetchError,
    error: fetchError,
  } = useQuery({
    queryKey: ['event', eventId],
    queryFn: () => fetchEvent(eventId),
    enabled: isEditMode && !isNaN(eventId),
  });

  // ── Create mutation ────────────────────────────────────────────────────────
  const createMutation = useMutation({
    mutationFn: ({ values, coverImage }: { values: EventFormValues; coverImage: File | null }) =>
      createEvent(values, coverImage),
    onSuccess: (created) => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      navigate(`/events/${created.id}`);
    },
    onError: (err: Error) => {
      setSubmitError(err.message);
    },
  });

  // ── Update mutation ────────────────────────────────────────────────────────
  const updateMutation = useMutation({
    mutationFn: ({ values, coverImage, removeCoverImage }: { values: EventFormValues; coverImage: File | null; removeCoverImage: boolean }) =>
      updateEvent(eventId, values, coverImage, removeCoverImage),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['event', eventId] });
      navigate(`/events/${updated.id}`);
    },
    onError: (err: Error) => {
      setSubmitError(err.message);
    },
  });

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleSubmit = async (values: EventFormValues, coverImage: File | null, removeCoverImage: boolean) => {
    setSubmitError(null);
    if (isEditMode) {
      updateMutation.mutate({ values, coverImage, removeCoverImage });
    } else {
      createMutation.mutate({ values, coverImage });
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  // ── Loading / error states for edit mode fetch ─────────────────────────────
  if (isEditMode && isFetchLoading) return <LoadingSpinner fullPage />;

  if (isEditMode && (isFetchError || !existingEvent)) {
    return (
      <div className="max-w-[1300px] mx-auto px-7 py-10">
        <ErrorMessage message={(fetchError as Error)?.message ?? 'Event not found.'} />
      </div>
    );
  }

  // Build default form values from the fetched event (edit) or empty (create)
  const defaultValues: Partial<EventFormValues> = existingEvent
    ? {
        title: existingEvent.title,
        description: existingEvent.description,
        location: existingEvent.location,
        startDate: toDatetimeLocal(existingEvent.startDate),
        endDate: toDatetimeLocal(existingEvent.endDate),
        isPublished: existingEvent.isPublished,
        categoryId: existingEvent.categoryId,
      }
    : { isPublished: false, categoryId: null };

  return (
    <main className="max-w-[1300px] mx-auto px-7 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-[13px] text-slate-400 mb-6">
        <button
          onClick={() => navigate('/admin')}
          className="hover:text-brand-600 transition-colors cursor-pointer"
        >
          Admin
        </button>
        <ChevronRight className="w-[13px] h-[13px] text-slate-300" />
        {isEditMode ? (
          <>
            <button
              onClick={() => navigate(`/events/${eventId}`)}
              className="hover:text-brand-600 transition-colors cursor-pointer truncate max-w-[200px]"
            >
              {existingEvent?.title ?? `Event #${eventId}`}
            </button>
            <ChevronRight className="w-[13px] h-[13px] text-slate-300" />
            <span className="text-slate-600 font-medium">Edit</span>
          </>
        ) : (
          <span className="text-slate-600 font-medium">New Event</span>
        )}
      </nav>

      <PageHeader
        title={isEditMode ? 'Edit Event' : 'Create New Event'}
        subtitle={
          isEditMode
            ? `Editing: ${existingEvent?.title}`
            : 'Fill in the details below to publish a new event.'
        }
      />

      {/* Mutation error banner */}
      {submitError && (
        <div className="flex items-center gap-2 px-3.5 py-3 bg-red-50 border border-red-200 rounded-sm text-[13px] text-red-600 mb-5">
          <AlertCircle className="w-[15px] h-[15px] flex-shrink-0" />
          {submitError}
        </div>
      )}

      {/* The form — key forces full re-mount when switching between new/edit */}
      <EventForm
        key={existingEvent?.id ?? 'new'}
        defaultValues={defaultValues}
        existingCoverImageUrl={existingEvent?.coverImageUrl}
        onSubmit={handleSubmit}
        onCancel={() => navigate(isEditMode ? `/events/${eventId}` : '/admin')}
        isSubmitting={isSubmitting}
        mode={isEditMode ? 'edit' : 'create'}
      />
    </main>
  );
}
