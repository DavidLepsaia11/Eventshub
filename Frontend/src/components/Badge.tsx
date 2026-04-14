// src/components/Badge.tsx

import { CheckCircle, Clock } from 'lucide-react';

type BadgeVariant = 'published' | 'draft' | 'brand' | 'amber' | 'red' | 'violet' | 'cyan' | 'slate' | 'green';

interface BadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
  showIcon?: boolean;
}

const variantClasses: Record<BadgeVariant, string> = {
  published: 'bg-emerald-50 text-emerald-600',
  draft:     'bg-amber-50 text-amber-600',
  brand:     'bg-brand-50 text-brand-600',
  amber:     'bg-amber-50 text-amber-600',
  red:       'bg-red-50 text-red-600',
  violet:    'bg-violet-50 text-violet-600',
  cyan:      'bg-sky-50 text-sky-700',
  slate:     'bg-slate-100 text-slate-500',
  green:     'bg-emerald-50 text-emerald-700',
};

export default function Badge({ variant, children, showIcon = false }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11.5px] font-semibold ${variantClasses[variant]}`}
    >
      {showIcon && variant === 'published' && <CheckCircle className="w-3 h-3" />}
      {showIcon && variant === 'draft' && <Clock className="w-3 h-3" />}
      {children}
    </span>
  );
}
