// src/components/EventForm.tsx
// Reusable controlled form for create and edit modes.
// Caller provides defaultValues and an onSubmit handler; this component owns
// only UI and validation — no API calls.

import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { FileText, MapPin, Calendar, AlignLeft, Save, X, Eye, ImagePlus, Trash2, Tag } from 'lucide-react';
import { fetchCategories } from '@/api/events';

export interface EventFormValues {
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  isPublished: boolean;
  categoryId: number | null;
}

interface EventFormProps {
  defaultValues?: Partial<EventFormValues>;
  existingCoverImageUrl?: string | null;
  onSubmit: (values: EventFormValues, coverImage: File | null, removeCoverImage: boolean) => Promise<void> | void;
  onCancel: () => void;
  isSubmitting?: boolean;
  mode: 'create' | 'edit';
}

interface FieldLabelProps {
  icon: React.ReactNode;
  label: string;
  required?: boolean;
}

function FieldLabel({ icon, label, required }: FieldLabelProps) {
  return (
    <label className="flex items-center gap-1.5 text-[13px] font-semibold text-slate-700 mb-[7px]">
      <span className="text-slate-400">{icon}</span>
      {label}
      {required && <span className="text-red-500">*</span>}
    </label>
  );
}

export default function EventForm({
  defaultValues,
  existingCoverImageUrl,
  onSubmit,
  onCancel,
  isSubmitting = false,
  mode,
}: EventFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EventFormValues>({ defaultValues });

  // Categories
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  // Cover image state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resolveUrl = (url: string) =>
    url.startsWith('http') ? url : `${import.meta.env.VITE_API_URL}${url}`;
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    existingCoverImageUrl ? resolveUrl(existingCoverImageUrl) : null,
  );
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [removeCover, setRemoveCover] = useState(false);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;
    setCoverFile(file);
    setRemoveCover(false);
    setPreviewUrl(URL.createObjectURL(file));
  }

  function handleRemoveCover() {
    setCoverFile(null);
    setRemoveCover(true);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  const inputClass = (hasError: boolean) =>
    [
      'w-full px-[14px] py-[10px] border-[1.5px] rounded-sm text-[14px] font-[inherit] text-slate-800 outline-none transition-all duration-[180ms] bg-white placeholder:text-slate-300',
      hasError
        ? 'border-red-400 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]'
        : 'border-slate-200 focus:border-brand-600 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]',
    ].join(' ');

  return (
    <form onSubmit={handleSubmit((values) => onSubmit(values, coverFile, removeCover))} noValidate>
      {/* Basic Info section */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden mb-[18px]">
        <div className="flex items-center gap-2.5 px-[22px] py-4 border-b border-slate-100 bg-slate-50">
          <FileText className="w-4 h-4 text-brand-600" />
          <span className="text-[14px] font-bold text-slate-800">Basic Information</span>
        </div>
        <div className="p-[22px] flex flex-col gap-[18px]">
          {/* Title */}
          <div>
            <FieldLabel icon={<FileText className="w-[13px] h-[13px]" />} label="Event Title" required />
            <input
              {...register('title', {
                required: 'Title is required',
                maxLength: { value: 200, message: 'Max 200 characters' },
              })}
              placeholder="e.g. Summer Music Festival 2025"
              className={inputClass(!!errors.title)}
            />
            {errors.title && (
              <p className="text-[11.5px] text-red-500 mt-1">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <FieldLabel icon={<AlignLeft className="w-[13px] h-[13px]" />} label="Description" required />
            <textarea
              {...register('description', {
                required: 'Description is required',
                maxLength: { value: 2000, message: 'Max 2000 characters' },
              })}
              rows={5}
              placeholder="Describe the event, agenda, speakers, etc."
              className={`${inputClass(!!errors.description)} resize-y leading-relaxed`}
            />
            {errors.description && (
              <p className="text-[11.5px] text-red-500 mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* Location */}
          <div>
            <FieldLabel icon={<MapPin className="w-[13px] h-[13px]" />} label="Location" required />
            <input
              {...register('location', {
                required: 'Location is required',
                maxLength: { value: 500, message: 'Max 500 characters' },
              })}
              placeholder="e.g. Tbilisi Convention Center, Tbilisi"
              className={inputClass(!!errors.location)}
            />
            {errors.location && (
              <p className="text-[11.5px] text-red-500 mt-1">{errors.location.message}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <FieldLabel icon={<Tag className="w-[13px] h-[13px]" />} label="Category" />
            <select
              {...register('categoryId', { setValueAs: (v) => (v === '' ? null : Number(v)) })}
              disabled={categoriesLoading}
              className={`${inputClass(false)} ${categoriesLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <option value="">— No category —</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Date section */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden mb-[18px]">
        <div className="flex items-center gap-2.5 px-[22px] py-4 border-b border-slate-100 bg-slate-50">
          <Calendar className="w-4 h-4 text-brand-600" />
          <span className="text-[14px] font-bold text-slate-800">Date & Time</span>
        </div>
        <div className="p-[22px]">
          <div className="grid grid-cols-2 gap-[18px]">
            {/* Start date */}
            <div>
              <FieldLabel icon={<Calendar className="w-[13px] h-[13px]" />} label="Start Date" required />
              <input
                type="datetime-local"
                {...register('startDate', { required: 'Start date is required' })}
                className={inputClass(!!errors.startDate)}
              />
              {errors.startDate && (
                <p className="text-[11.5px] text-red-500 mt-1">{errors.startDate.message}</p>
              )}
            </div>

            {/* End date */}
            <div>
              <FieldLabel icon={<Calendar className="w-[13px] h-[13px]" />} label="End Date" required />
              <input
                type="datetime-local"
                {...register('endDate', { required: 'End date is required' })}
                className={inputClass(!!errors.endDate)}
              />
              {errors.endDate && (
                <p className="text-[11.5px] text-red-500 mt-1">{errors.endDate.message}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cover Photo section */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden mb-[18px]">
        <div className="flex items-center gap-2.5 px-[22px] py-4 border-b border-slate-100 bg-slate-50">
          <ImagePlus className="w-4 h-4 text-brand-600" />
          <span className="text-[14px] font-bold text-slate-800">Cover Photo</span>
        </div>
        <div className="p-[22px]">
          {previewUrl ? (
            <div className="relative w-full">
              <img
                src={previewUrl}
                alt="Cover preview"
                className="w-full h-48 object-cover rounded-sm border border-slate-200"
              />
              <button
                type="button"
                onClick={handleRemoveCover}
                className="absolute top-2 right-2 inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-slate-200 rounded-sm text-[12px] font-semibold text-red-500 hover:bg-red-50 hover:border-red-200 transition-colors shadow-xs"
              >
                <Trash2 className="w-3 h-3" />
                Remove
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-36 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-200 rounded-sm text-slate-400 hover:border-brand-400 hover:text-brand-500 transition-colors cursor-pointer"
            >
              <ImagePlus className="w-6 h-6" />
              <span className="text-[13px] font-medium">Click to upload cover photo</span>
              <span className="text-[11px]">JPG, PNG, WEBP — max 5 MB</span>
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            onChange={handleFileChange}
          />
        </div>
      </div>

      {/* Visibility / Published toggle */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden mb-[18px]">
        <div className="flex items-center gap-2.5 px-[22px] py-4 border-b border-slate-100 bg-slate-50">
          <Eye className="w-4 h-4 text-brand-600" />
          <span className="text-[14px] font-bold text-slate-800">Visibility</span>
        </div>
        <div className="p-[22px]">
          <label className="flex items-center justify-between cursor-pointer select-none">
            <div>
              <p className="text-[14px] font-semibold text-slate-800">Published</p>
              <p className="text-[12px] text-slate-400 mt-0.5">When enabled, the event is visible to the public.</p>
            </div>
            <input type="checkbox" {...register('isPublished')} className="sr-only peer" />
            <div className="relative w-10 h-[22px] bg-slate-200 rounded-full peer peer-checked:bg-brand-600 transition-colors after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:w-4 after:h-4 after:bg-white after:rounded-full after:transition-all peer-checked:after:translate-x-[18px] after:shadow-sm" />
          </label>
        </div>
      </div>

      {/* Footer actions */}
      <div className="flex items-center justify-end gap-2.5 pb-20">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xs border border-slate-200 bg-white text-[14px] font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-xs disabled:opacity-50"
        >
          <X className="w-[15px] h-[15px]" />
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm bg-brand-600 text-white text-[14px] font-semibold hover:bg-brand-700 hover:-translate-y-px transition-all shadow-brand hover:shadow-brand-lg disabled:opacity-60 disabled:translate-y-0"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin w-[15px] h-[15px]" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Saving…
            </>
          ) : (
            <>
              <Save className="w-[15px] h-[15px]" />
              {mode === 'create' ? 'Create Event' : 'Save Changes'}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
