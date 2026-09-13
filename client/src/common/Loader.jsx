import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Loader({ text = 'Loading content...', fullPage = false }) {
  if (fullPage) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 gap-3">
        <Loader2 className="w-10 h-10 text-brand-500 animate-spin" />
        <p className="text-xs font-bold text-surface-800 tracking-wide uppercase animate-pulse">
          {text}
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-2 py-8">
      <Loader2 className="w-5 h-5 text-brand-500 animate-spin" />
      <span className="text-xs font-bold text-surface-800">{text}</span>
    </div>
  );
}