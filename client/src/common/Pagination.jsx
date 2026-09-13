import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ currentPage = 1, totalPages = 1, onPageChange }) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-10">
      {/* Previous Page Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2.5 rounded-xl bg-surface-100 border border-surface-200 text-surface-800 hover:bg-surface-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
        aria-label="Previous Page"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* First Page Quick Link */}
      {getPageNumbers()[0] > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="w-9 h-9 rounded-xl text-xs font-bold bg-surface-100 border border-surface-200 text-surface-800 hover:bg-surface-200 transition-all"
          >
            1
          </button>
          {getPageNumbers()[0] > 2 && (
            <span className="text-xs font-bold text-surface-400 px-1">...</span>
          )}
        </>
      )}

      {/* Page Numbers */}
      {getPageNumbers().map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-9 h-9 rounded-xl text-xs font-black transition-all active:scale-95 ${
            currentPage === page
              ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
              : 'bg-surface-100 border border-surface-200 text-surface-800 hover:bg-surface-200'
          }`}
        >
          {page}
        </button>
      ))}

      {/* Last Page Quick Link */}
      {getPageNumbers()[getPageNumbers().length - 1] < totalPages && (
        <>
          {getPageNumbers()[getPageNumbers().length - 1] < totalPages - 1 && (
            <span className="text-xs font-bold text-surface-400 px-1">...</span>
          )}
          <button
            onClick={() => onPageChange(totalPages)}
            className="w-9 h-9 rounded-xl text-xs font-bold bg-surface-100 border border-surface-200 text-surface-800 hover:bg-surface-200 transition-all"
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Next Page Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2.5 rounded-xl bg-surface-100 border border-surface-200 text-surface-800 hover:bg-surface-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
        aria-label="Next Page"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}