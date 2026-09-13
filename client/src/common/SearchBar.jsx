import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight, Sparkles, Clock, Compass } from 'lucide-react';

const PLACEHOLDER_PHRASES = [
  'Search products, brands, categories...',
  "Find something you'll love...",
  'Explore something new...',
];

const DEFAULT_SUGGESTIONS = [
  'Wireless Headphones',
  'Ergonomic Mechanical Keyboard',
  '4K Monitor',
  'Smart Fitness Watch',
  'USB-C Hub',
  'Leather Wallet',
  'Running Shoes',
];

export default function SearchBar({ 
  onSearchComplete, 
  placeholder,
  suggestionsList = DEFAULT_SUGGESTIONS 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  // Filter suggestions based on user input
  const filteredSuggestions = searchQuery.trim()
    ? suggestionsList.filter(item => 
        item.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 6)
    : [];

  // Dynamic placeholder rotation (pauses when focused or active)
  useEffect(() => {
    if (placeholder || isOpen || searchQuery) return;
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDER_PHRASES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [placeholder, isOpen, searchQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const executeSearch = (query) => {
    if (query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
      setIsMobileOpen(false);
      if (onSearchComplete) onSearchComplete();
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (selectedIndex >= 0 && filteredSuggestions[selectedIndex]) {
      executeSearch(filteredSuggestions[selectedIndex]);
    } else {
      executeSearch(searchQuery);
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen || filteredSuggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filteredSuggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredSuggestions.length - 1));
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setIsMobileOpen(false);
    }
  };

  const activePlaceholder = placeholder || PLACEHOLDER_PHRASES[placeholderIndex];

  return (
    <>
      {/* Dynamic Keyframes for Light-Travel Border Glow */}
      <style>{`
        @keyframes brandBorderGlowOnce {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        .animate-brand-border {
          background-size: 200% 200%;
          animation: brandBorderGlowOnce 1.2s cubic-bezier(0.4, 0, 0.2, 1) 1 forwards;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-brand-border, .transition-all {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>

      {/* Main Search Bar Container */}
      <div 
        ref={searchRef} 
        className={`relative w-full transition-all duration-300 ease-out ${
          isOpen ? 'md:max-w-xl' : 'md:max-w-md'
        }`}
      >
        <form 
          onSubmit={handleSearchSubmit} 
          className="relative w-full"
          role="search"
        >
          {/* Outer Border with Soft Shadow and Theme Gradient Glow */}
          <div 
            className={`relative rounded-full p-[1px] transition-all duration-300 ${
              isOpen 
                ? 'bg-gradient-to-r from-brand-500 via-tealAccent-500 to-brand-600 animate-brand-border shadow-lg shadow-brand-500/10' 
                : 'bg-surface-200 hover:bg-brand-500/30'
            }`}
          >
            <div className="relative flex items-center bg-surface-100 rounded-full">
              
              {/* Animated Search Icon */}
              <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center">
                <Search 
                  className={`w-4 h-4 transition-all duration-300 ${
                    isOpen 
                      ? 'text-brand-500 scale-110 -translate-y-0.5 translate-x-0.5' 
                      : 'text-surface-800/50'
                  }`} 
                />
              </div>

              {/* Form Input */}
              <input
                ref={inputRef}
                type="text"
                role="combobox"
                aria-expanded={isOpen}
                aria-autocomplete="list"
                aria-controls="search-suggestions-list"
                placeholder={activePlaceholder}
                value={searchQuery}
                onFocus={() => {
                  setIsOpen(true);
                  if (window.innerWidth < 768) setIsMobileOpen(true);
                }}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsOpen(true);
                  setSelectedIndex(-1);
                }}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent text-surface-900 placeholder:text-surface-800/40 text-sm rounded-full py-2.5 pl-11 pr-20 outline-none transition-all duration-200"
              />

              {/* Right Action Controls */}
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedIndex(-1);
                      inputRef.current?.focus();
                    }}
                    className="p-1 rounded-full hover:bg-surface-200/60 text-surface-800/60 hover:text-surface-900 transition-colors"
                    aria-label="Clear search input"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}

                {/* Circular Action Button */}
                <button
                  type="submit"
                  className={`p-1.5 rounded-full flex items-center justify-center transition-all duration-200 ${
                    searchQuery.trim()
                      ? 'bg-brand-500 hover:bg-brand-600 text-white shadow-sm hover:scale-105'
                      : 'bg-surface-200/60 text-surface-800/60 hover:bg-surface-200'
                  }`}
                  aria-label="Submit search"
                >
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                </button>
              </div>

            </div>
          </div>
        </form>

        {/* Desktop Suggestions Floating Dropdown */}
        {isOpen && filteredSuggestions.length > 0 && (
          <div 
            id="search-suggestions-list"
            role="listbox"
            className="hidden md:block absolute left-0 right-0 top-full mt-2 bg-surface-100 rounded-2xl shadow-xl border border-surface-200 py-3 z-50 overflow-hidden animate-in fade-in-0 slide-in-from-top-2 duration-200"
          >
            {/* "Discover" Header Badge */}
            <div className="px-4 pb-2 mb-1 border-b border-surface-200/60 flex items-center justify-between text-[11px] font-bold tracking-widest text-surface-800/60 uppercase">
              <span className="flex items-center gap-1.5 text-tealAccent-500 font-semibold">
                <Sparkles className="w-3 h-3 text-brand-500" />
                ✦ DISCOVER
              </span>
              <span className="text-[10px] font-normal text-surface-800/50">
                {filteredSuggestions.length} matches
              </span>
            </div>

            <ul className="py-1">
              {filteredSuggestions.map((item, index) => {
                const isSelected = index === selectedIndex;
                return (
                  <li key={item} role="option" aria-selected={isSelected}>
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery(item);
                        executeSearch(item);
                      }}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between transition-all duration-150 group ${
                        isSelected
                          ? 'bg-brand-50 text-brand-900 font-medium'
                          : 'text-surface-900 hover:bg-brand-50/50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Compass className={`w-3.5 h-3.5 flex-shrink-0 transition-colors ${
                          isSelected ? 'text-brand-500' : 'text-surface-800/40'
                        }`} />
                        <span className="truncate">{item}</span>
                      </div>
                      
                      <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                        <span className={`text-[11px] opacity-0 group-hover:opacity-100 transition-opacity ${
                          isSelected ? 'text-brand-600' : 'text-surface-800/50'
                        }`}>
                          Search
                        </span>
                        <ArrowRight className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          isSelected 
                            ? 'opacity-100 text-brand-500 translate-x-1' 
                            : 'opacity-0 group-hover:opacity-100 text-surface-800/40 group-hover:translate-x-0.5'
                        }`} />
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="mt-1 pt-2 border-t border-surface-200/60 px-4 text-right">
              <button
                type="button"
                onClick={handleSearchSubmit}
                className="text-[12px] font-medium text-surface-800 hover:text-brand-500 transition-colors inline-flex items-center gap-1 group"
              >
                View all results 
                <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Full-Screen Search Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 bg-surface-50 z-50 md:hidden flex flex-col animate-in fade-in-0 duration-200">
          
          {/* Mobile Header Bar */}
          <div className="p-4 border-b border-surface-200 flex items-center gap-3 bg-surface-100">
            <button
              type="button"
              onClick={() => setIsMobileOpen(false)}
              className="p-2 -ml-2 rounded-full text-surface-900 hover:bg-surface-200/60"
              aria-label="Close search"
            >
              <X className="w-5 h-5" />
            </button>

            <form onSubmit={handleSearchSubmit} className="flex-1 relative">
              <input
                type="text"
                autoFocus
                placeholder={activePlaceholder}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSelectedIndex(-1);
                }}
                className="w-full bg-surface-50 text-surface-900 placeholder:text-surface-800/40 text-base rounded-full py-2.5 pl-4 pr-10 outline-none border border-surface-200 focus:border-brand-500"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-surface-800/50"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </form>
          </div>

          {/* Mobile Body Content */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="mb-4 flex items-center gap-1.5 text-xs font-bold tracking-widest text-tealAccent-500 uppercase">
              <Sparkles className="w-3.5 h-3.5 text-brand-500" />
              ✦ DISCOVER
            </div>

            {filteredSuggestions.length > 0 ? (
              <ul className="divide-y divide-surface-200/60">
                {filteredSuggestions.map((item) => (
                  <li key={item}>
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery(item);
                        executeSearch(item);
                      }}
                      className="w-full text-left py-3.5 text-base text-surface-900 flex items-center justify-between min-h-[44px] active:bg-brand-50/50"
                    >
                      <span className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-surface-800/40" />
                        {item}
                      </span>
                      <ArrowRight className="w-4 h-4 text-surface-800/40" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-12 text-surface-800/50 text-sm">
                Type to explore products, brands, or categories...
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}