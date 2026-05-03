/**
 * Reusable Loading Skeleton
 * Provides premium visual feedback during async operations.
 * Supports text, card, and chart variants.
 */

interface SkeletonProps {
  className?: string;
  lines?: number;
  variant?: 'text' | 'card' | 'chart';
}

function SkeletonLine({ className = '' }: { className?: string }) {
  return <div className={`skeleton h-4 ${className}`} />;
}

export default function Skeleton({ className = '', lines = 3, variant = 'text' }: SkeletonProps) {
  if (variant === 'card') {
    return (
      <div className={`animate-pulse space-y-4 p-6 bg-white rounded-3xl border border-gray-100 ${className}`}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-200 rounded-2xl" />
          <div className="flex-1 space-y-2">
            <div className="skeleton h-4 w-3/4" />
            <div className="skeleton h-3 w-1/2" />
          </div>
        </div>
        <div className="space-y-2">
          {Array.from({ length: lines }).map((_, i) => (
            <SkeletonLine key={i} className={i === lines - 1 ? 'w-2/3' : 'w-full'} />
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'chart') {
    return (
      <div className={`animate-pulse p-6 bg-white rounded-3xl border border-gray-100 ${className}`}>
        <div className="skeleton h-5 w-1/3 mb-6" />
        <div className="flex items-end gap-2 h-40">
          {[65, 40, 85, 55, 90, 45, 70].map((h, i) => (
            <div
              key={i}
              className="skeleton flex-1 rounded-t-lg"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>
    );
  }

  // Default: text lines
  return (
    <div className={`animate-pulse space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonLine key={i} className={i === lines - 1 ? 'w-4/5' : 'w-full'} />
      ))}
    </div>
  );
}
