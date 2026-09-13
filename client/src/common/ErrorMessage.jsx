import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function ErrorMessage({ 
  title = "Something went wrong", 
  message = "Failed to load data. Please check your connection and try again.", 
  onRetry 
}) {
  return (
    <div className="max-w-md mx-auto my-8 p-6 rounded-2xl bg-rose-50/80 border border-rose-200 text-center shadow-sm">
      <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-sm font-black text-rose-950 tracking-tight">{title}</h3>
      <p className="text-xs font-medium text-rose-800 mt-1 leading-relaxed">{message}</p>
      
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20 active:scale-95 transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
}