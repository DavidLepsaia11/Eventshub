// src/components/ErrorMessage.tsx

import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  /** Optional retry callback rendered as a button. */
  onRetry?: () => void;
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-14 h-14 rounded-xl bg-red-50 flex items-center justify-center mb-4">
        <AlertCircle className="w-7 h-7 text-red-500" />
      </div>
      <h3 className="text-base font-bold text-slate-800 mb-2">Something went wrong</h3>
      <p className="text-sm text-slate-500 max-w-xs mb-5">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xs bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 transition-colors shadow-brand"
        >
          Try again
        </button>
      )}
    </div>
  );
}
