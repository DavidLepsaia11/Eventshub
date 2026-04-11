// src/pages/admin/AdminPage.tsx
// Admin dashboard: table of ALL events with CRUD actions.

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchEvents, deleteEvent } from '@/api/events';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import PageHeader from '@/components/PageHeader';
import Badge from '@/components/Badge';
import ConfirmDialog from '@/components/ConfirmDialog';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  CalendarDays,
  MapPin,
  BarChart3,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import type { EventDto } from '@/types/event';

export default function AdminPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [tableSearch, setTableSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<EventDto | null>(null);

  const { data: events, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['events'],
    queryFn: fetchEvents,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      setDeleteTarget(null);
    },
  });

  const tableFiltered = (events ?? []).filter(
    (e) =>
      tableSearch.trim() === '' ||
      e.title.toLowerCase().includes(tableSearch.toLowerCase()) ||
      e.location.toLowerCase().includes(tableSearch.toLowerCase()),
  );

  const totalCount = events?.length ?? 0;
  const publishedCount = events?.filter((e) => e.isPublished).length ?? 0;
  const draftCount = totalCount - publishedCount;

  return (
    <main className="max-w-[1300px] mx-auto px-7 py-10 pb-20">
      <PageHeader
        title="Event Management"
        subtitle="Create, edit, publish and delete events."
        actions={
          <button
            onClick={() => navigate('/admin/events/new')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm bg-brand-600 text-white text-[14px] font-semibold hover:bg-brand-700 hover:-translate-y-px transition-all shadow-brand"
          >
            <Plus className="w-[15px] h-[15px]" />
            New Event
          </button>
        }
      />

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-7">
        <StatCard
          label="Total Events"
          value={totalCount}
          iconClass="bg-brand-50 text-brand-600"
          icon={<BarChart3 className="w-5 h-5" />}
        />
        <StatCard
          label="Published"
          value={publishedCount}
          iconClass="bg-emerald-50 text-emerald-600"
          icon={<CheckCircle className="w-5 h-5" />}
        />
        <StatCard
          label="Drafts"
          value={draftCount}
          iconClass="bg-amber-50 text-amber-600"
          icon={<Clock className="w-5 h-5" />}
        />
        <StatCard
          label="Locations"
          value={new Set(events?.map((e) => e.location) ?? []).size}
          iconClass="bg-violet-50 text-violet-600"
          icon={<MapPin className="w-5 h-5" />}
        />
      </div>

      {/* Table card */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <div className="flex items-center gap-2.5 px-3.5 py-2 bg-slate-50 border-[1.5px] border-slate-200 rounded-sm text-[13px] text-slate-500 w-[240px]">
            <Search className="w-[15px] h-[15px] flex-shrink-0" />
            <input
              type="text"
              value={tableSearch}
              onChange={(e) => setTableSearch(e.target.value)}
              placeholder="Search events…"
              className="border-none bg-transparent outline-none font-[inherit] text-[13px] text-slate-700 w-full"
            />
          </div>
          <span className="text-[13px] text-slate-400 font-medium">
            {tableFiltered.length} event{tableFiltered.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Body states */}
        {isLoading && <LoadingSpinner />}
        {isError && (
          <ErrorMessage
            message={(error as Error)?.message ?? 'Failed to load events.'}
            onRetry={() => refetch()}
          />
        )}

        {!isLoading && !isError && tableFiltered.length === 0 && (
          <div className="text-center py-16 px-6">
            <div className="w-16 h-16 rounded-xl bg-brand-50 flex items-center justify-center mx-auto mb-4">
              <CalendarDays className="w-8 h-8 text-brand-600" />
            </div>
            <h3 className="text-[18px] font-extrabold text-slate-800 mb-2 tracking-[-0.3px]">
              No events found
            </h3>
            <p className="text-[14px] text-slate-400 max-w-xs mx-auto leading-[1.7] mb-6">
              {tableSearch.trim() !== ''
                ? `No events match "${tableSearch}".`
                : 'Get started by creating your first event.'}
            </p>
            {tableSearch.trim() === '' && (
              <button
                onClick={() => navigate('/admin/events/new')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm bg-brand-600 text-white text-[14px] font-semibold shadow-brand hover:bg-brand-700 transition-colors"
              >
                <Plus className="w-[15px] h-[15px]" />
                Create First Event
              </button>
            )}
          </div>
        )}

        {!isLoading && !isError && tableFiltered.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  {['Event', 'Location', 'Start', 'End', 'Status', 'Actions'].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-[11.5px] font-bold text-slate-400 uppercase tracking-[0.5px] whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableFiltered.map((event) => (
                  <tr
                    key={event.id}
                    className="border-b border-slate-100 last:border-none transition-colors hover:[&>td]:bg-brand-50 cursor-pointer"
                    onClick={() => navigate(`/events/${event.id}`)}
                  >
                    {/* Event cell */}
                    <td className="px-4 py-3.5 transition-colors">
                      <div className="flex items-center gap-3">
                        {event.coverImageUrl ? (
                          <img
                            src={event.coverImageUrl.startsWith('http') ? event.coverImageUrl : `${import.meta.env.VITE_API_URL}${event.coverImageUrl}`}
                            alt={event.title}
                            className="w-[42px] h-[42px] rounded-sm flex-shrink-0 object-cover"
                          />
                        ) : (
                          <div
                            className="w-[42px] h-[42px] rounded-sm flex-shrink-0 flex items-center justify-center text-[18px]"
                            style={{
                              background: `linear-gradient(135deg, hsl(${(event.id * 47) % 360}, 60%, 30%), hsl(${(event.id * 47 + 60) % 360}, 70%, 55%))`,
                            }}
                          >
                            {['🎵', '🏆', '🎭', '🎪', '🎨', '💻'][event.id % 6]}
                          </div>
                        )}
                        <div>
                          <p className="text-[14px] font-semibold text-slate-800 line-clamp-1">
                            {event.title}
                          </p>
                          <p className="text-[12px] text-slate-400 mt-0.5">ID #{event.id}</p>
                        </div>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="px-4 py-3.5 transition-colors">
                      <div className="flex items-center gap-1.5 text-[13.5px] text-slate-600 max-w-[180px]">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span className="truncate">{event.location}</span>
                      </div>
                    </td>

                    {/* Start */}
                    <td className="px-4 py-3.5 text-[13.5px] text-slate-600 whitespace-nowrap transition-colors">
                      {format(parseISO(event.startDate), 'MMM d, yyyy')}
                    </td>

                    {/* End */}
                    <td className="px-4 py-3.5 text-[13.5px] text-slate-600 whitespace-nowrap transition-colors">
                      {format(parseISO(event.endDate), 'MMM d, yyyy')}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5 transition-colors">
                      <Badge variant={event.isPublished ? 'published' : 'draft'} showIcon>
                        {event.isPublished ? 'Published' : 'Draft'}
                      </Badge>
                    </td>

                    {/* Actions */}
                    <td
                      className="px-4 py-3.5 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => navigate(`/admin/events/${event.id}/edit`)}
                          title="Edit"
                          className="p-2 rounded-xs bg-white border border-slate-200 shadow-xs text-slate-500 hover:bg-slate-50 hover:text-slate-700 hover:border-slate-300 transition-colors"
                        >
                          <Edit className="w-[15px] h-[15px]" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(event)}
                          title="Delete"
                          className="p-2 rounded-xs bg-white border border-slate-200 shadow-xs text-slate-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                        >
                          <Trash2 className="w-[15px] h-[15px]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirm delete dialog */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Event"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmLabel="Delete Event"
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        onCancel={() => setDeleteTarget(null)}
        isLoading={deleteMutation.isPending}
      />
    </main>
  );
}

// ── Internal StatCard ──────────────────────────────────────────────────────────
interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  iconClass: string;
}

function StatCard({ label, value, icon, iconClass }: StatCardProps) {
  return (
    <div className="bg-white rounded-md p-5 border border-slate-200 shadow-xs flex items-start gap-3.5">
      <div className={`w-[42px] h-[42px] rounded-sm flex items-center justify-center flex-shrink-0 ${iconClass}`}>
        {icon}
      </div>
      <div>
        <p className="text-[26px] font-extrabold text-slate-900 tracking-[-0.6px] leading-none">
          {value}
        </p>
        <p className="text-[12.5px] text-slate-400 font-medium mt-0.5">{label}</p>
      </div>
    </div>
  );
}
