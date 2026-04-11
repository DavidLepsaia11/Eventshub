// src/components/LoadingSpinner.tsx

interface LoadingSpinnerProps {
  /** Full-page centered overlay. Defaults to false (inline). */
  fullPage?: boolean;
  /** Size in pixels. Defaults to 32. */
  size?: number;
}

export default function LoadingSpinner({ fullPage = false, size = 32 }: LoadingSpinnerProps) {
  const spinner = (
    <svg
      style={{ width: size, height: size }}
      className="animate-spin text-brand-600"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-label="Loading"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm">
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-20">
      {spinner}
    </div>
  );
}
