import React from 'react';

const STEPS = [
  { key: 'pending', label: 'Order Placed' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'processing', label: 'Processing' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'delivered', label: 'Delivered' },
];

export default function OrderStatusTracker({ currentStatus }) {
  if (currentStatus === 'cancelled') {
    return (
      <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-center">
        <span className="text-red-600 font-extrabold text-base sm:text-lg">Order Cancelled</span>
        <p className="text-surface-600 text-xs sm:text-sm font-semibold mt-1">
          This order was cancelled and inventory stock was restored.
        </p>
      </div>
    );
  }

  const currentIdx = STEPS.findIndex((step) => step.key === currentStatus);

  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between relative">
        {/* Progress Bar Line Background */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-surface-200 -translate-y-1/2 z-0 rounded-full" />
        
        {/* Active Progress Bar Line Fill */}
        <div 
          className="absolute top-1/2 left-0 h-1 bg-brand-500 -translate-y-1/2 z-0 transition-all duration-300 rounded-full" 
          style={{ width: `${(Math.max(0, currentIdx) / (STEPS.length - 1)) * 100}%` }}
        />

        {STEPS.map((step, idx) => {
          const isCompleted = idx <= currentIdx;
          const isCurrent = idx === currentIdx;

          return (
            <div key={step.key} className="relative z-10 flex flex-col items-center">
              {/* Step Circle */}
              <div
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-black text-xs sm:text-sm transition-all duration-300 ${
                  isCompleted
                    ? 'bg-brand-500 text-white ring-4 ring-surface-100 shadow-sm'
                    : 'bg-surface-200 text-surface-600 ring-4 ring-surface-100'
                } ${isCurrent ? 'ring-brand-500/30 scale-110' : ''}`}
              >
                {idx + 1}
              </div>

              {/* Step Label - High Contrast Fix */}
              <span 
                className={`text-xs mt-2.5 text-center transition-colors ${
                  isCurrent 
                    ? 'font-black text-brand-500' 
                    : isCompleted 
                    ? 'font-black text-surface-900' 
                    : 'font-bold text-surface-600'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}