import React from 'react';
import { PackageSearch, RefreshCw } from 'lucide-react';

export default function EmptyState({
  title = 'No items found',
  description = 'We couldn’t find what you were looking for. Try adjusting your search or filters.',
  actionLabel = 'Reset Filters',
  onAction,
  icon: CustomIcon,
}) {
  const IconComponent = CustomIcon || PackageSearch;

  return (
    <div className="max-w-md mx-auto my-12 p-8 rounded-3xl bg-surface-100 border border-surface-200 text-center shadow-xs flex flex-col items-center">
      <div className="w-16 h-16 rounded-2xl bg-brand-50 border border-brand-500/20 text-brand-500 flex items-center justify-center mb-4 shadow-sm">
        <IconComponent className="w-8 h-8" />
      </div>

      <h3 className="text-base font-black text-surface-900 tracking-tight">{title}</h3>
      <p className="text-xs font-medium text-surface-800/80 mt-1.5 leading-relaxed">
        {description}
      </p>

      {onAction && (
        <button
          onClick={onAction}
          className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-md shadow-brand-500/20 active:scale-95 transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
}