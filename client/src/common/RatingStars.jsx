import React from 'react';
import { Star } from 'lucide-react';

export default function RatingStars({ rating = 0, reviewCount, size = 'sm' }) {
  const sizeMap = {
    xs: 'w-3 h-3',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const starSize = sizeMap[size] || sizeMap.sm;

  return (
    <div className="flex items-center gap-1.5 select-none">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFull = rating >= star;
          const isHalf = rating >= star - 0.5 && rating < star;

          return (
            <div key={star} className="relative">
              {/* Star Background Outline */}
              <Star className={`${starSize} text-surface-200 fill-surface-100`} />

              {/* Full Star Overlay */}
              {isFull && (
                <Star className={`${starSize} absolute inset-0 text-amber-400 fill-amber-400`} />
              )}

              {/* Half Star Overlay */}
              {isHalf && (
                <div className="absolute inset-0 overflow-hidden w-[50%]">
                  <Star className={`${starSize} text-amber-400 fill-amber-400`} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Numerical Rating & Optional Review Count */}
      <span className="text-xs font-bold text-surface-900 leading-none">
        {Number(rating).toFixed(1)}
      </span>

      {reviewCount !== undefined && (
        <span className="text-[11px] font-medium text-surface-800 leading-none">
          ({reviewCount})
        </span>
      )}
    </div>
  );
}