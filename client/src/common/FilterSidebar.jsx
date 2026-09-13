import React, { useState } from 'react';
import {
  SlidersHorizontal,
  X,
  RotateCcw,
  Check,
  Tag,
  DollarSign,
  Package,
  Layers,
  Sparkles,
  ChevronDown
} from 'lucide-react';

export default function FilterSidebar({
  categories = [],
  // Support both pattern styles seamlessly
  filters,
  onFilterChange,
  selectedCategory: propCategory,
  onSelectCategory,
  priceRange: propPriceRange,
  onPriceChange,
  inStockOnly: propInStock,
  onToggleInStock,
  onResetFilters,
  onReset,
  isOpen = false,
  onCloseMobile,
}) {
  // Resolve unified state values
  const activeCategory = filters ? filters.category : (propCategory || '');
  const activeMinPrice = filters ? filters.minPrice : (propPriceRange?.min || '');
  const activeMaxPrice = filters ? filters.maxPrice : (propPriceRange?.max || '');
  const activeInStock = filters ? filters.inStock : (propInStock || false);

  // Accordion section states for collapsible UI
  const [collapsedSections, setCollapsedSections] = useState({
    categories: false,
    price: false,
    availability: false,
  });

  const toggleSection = (section) => {
    setCollapsedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleCategorySelect = (catVal) => {
    if (onFilterChange) onFilterChange('category', catVal);
    else if (onSelectCategory) onSelectCategory(catVal);
  };

  const handlePriceChange = (type, val) => {
    if (onFilterChange) onFilterChange(type === 'min' ? 'minPrice' : 'maxPrice', val);
    else if (onPriceChange) onPriceChange(type, val);
  };

  const handleInStockToggle = (checked) => {
    if (onFilterChange) onFilterChange('inStock', checked);
    else if (onToggleInStock) onToggleInStock(checked);
  };

  const handleReset = () => {
    if (onReset) onReset();
    else if (onResetFilters) onResetFilters();
  };

  const hasActiveFilters = Boolean(
    activeCategory || activeMinPrice || activeMaxPrice || activeInStock
  );

  // Count active badges for visual indicator
  const activeFilterCount = [
    Boolean(activeCategory),
    Boolean(activeMinPrice || activeMaxPrice),
    Boolean(activeInStock)
  ].filter(Boolean).length;

  const sidebarContent = (
    <div className="space-y-5">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between pb-4 border-b border-surface-200/80">
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-surface-900 text-surface-50 shadow-xs">
            <SlidersHorizontal className="w-4 h-4 text-brand-500" />
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-500 text-[9px] font-black text-white ring-2 ring-surface-100">
                {activeFilterCount}
              </span>
            )}
          </div>
          <div>
            <h2 className="text-xs font-black uppercase tracking-widest text-surface-900">
              Refine Results
            </h2>
            <p className="text-[10px] font-medium text-surface-500">
              {hasActiveFilters ? `${activeFilterCount} active filter(s)` : 'No filters applied'}
            </p>
          </div>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleReset}
            className="group flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-all border border-rose-200/60 cursor-pointer active:scale-95"
          >
            <RotateCcw className="w-3 h-3 transition-transform group-hover:-rotate-180 duration-300" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Category Filter Section */}
      <div className="rounded-2xl border border-surface-200/60 bg-surface-50/50 p-3.5 space-y-3">
        <button
          type="button"
          onClick={() => toggleSection('categories')}
          className="w-full flex items-center justify-between text-left cursor-pointer group"
        >
          <div className="flex items-center gap-2">
            <Tag className="w-3.5 h-3.5 text-brand-500" />
            <h3 className="text-xs font-black uppercase tracking-wider text-surface-900">
              Categories
            </h3>
          </div>
          <div className="flex items-center gap-1.5">
            {categories.length > 0 && (
              <span className="text-[10px] font-black text-surface-500 bg-surface-200/60 px-2 py-0.5 rounded-full">
                {categories.length}
              </span>
            )}
            <ChevronDown
              className={`w-3.5 h-3.5 text-surface-400 transition-transform duration-200 ${
                collapsedSections.categories ? '-rotate-90' : ''
              }`}
            />
          </div>
        </button>

        {!collapsedSections.categories && (
          <div className="pt-1">
            <div className="flex flex-wrap gap-1.5 max-h-56 overflow-y-auto pr-1 scrollbar-thin">
              <button
                type="button"
                onClick={() => handleCategorySelect('')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                  activeCategory === ''
                    ? 'bg-surface-900 text-white shadow-xs font-black ring-1 ring-surface-900'
                    : 'bg-surface-100 text-surface-700 hover:bg-surface-200/70 border border-surface-200/60'
                }`}
              >
                <Layers className="w-3 h-3" />
                <span>All</span>
                {activeCategory === '' && <Check className="w-3 h-3 text-brand-500 stroke-[3]" />}
              </button>

              {categories.map((cat) => {
                const catIdentifier = cat.slug || cat._id || cat.name;
                const isSelected = activeCategory === catIdentifier;

                return (
                  <button
                    key={cat._id || cat.slug || cat.name}
                    type="button"
                    onClick={() => handleCategorySelect(catIdentifier)}
                    className={`px-3 py-1.5 rounded-xl text-xs transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-surface-900 text-white shadow-xs font-black ring-1 ring-surface-900'
                        : 'bg-surface-100 text-surface-700 hover:bg-surface-200/70 font-bold border border-surface-200/60'
                    }`}
                  >
                    <span>{cat.name}</span>
                    {isSelected && <Check className="w-3 h-3 text-brand-500 stroke-[3]" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Price Range Filter Section */}
      <div className="rounded-2xl border border-surface-200/60 bg-surface-50/50 p-3.5 space-y-3">
        <button
          type="button"
          onClick={() => toggleSection('price')}
          className="w-full flex items-center justify-between text-left cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <DollarSign className="w-3.5 h-3.5 text-brand-500" />
            <h3 className="text-xs font-black uppercase tracking-wider text-surface-900">
              Budget Range
            </h3>
          </div>
          <ChevronDown
            className={`w-3.5 h-3.5 text-surface-400 transition-transform duration-200 ${
              collapsedSections.price ? '-rotate-90' : ''
            }`}
          />
        </button>

        {!collapsedSections.price && (
          <div className="space-y-3 pt-1">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-surface-500">
                  Minimum
                </span>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-extrabold text-surface-400">
                    $
                  </span>
                  <input
                    type="number"
                    placeholder="0"
                    value={activeMinPrice}
                    onChange={(e) => handlePriceChange('min', e.target.value)}
                    className="w-full pl-6 pr-2 py-2 rounded-xl bg-surface-100 border border-surface-200 text-xs font-extrabold text-surface-900 focus:outline-none focus:border-brand-500 focus:bg-white transition-all"
                    min="0"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-surface-500">
                  Maximum
                </span>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-extrabold text-surface-400">
                    $
                  </span>
                  <input
                    type="number"
                    placeholder="Any"
                    value={activeMaxPrice}
                    onChange={(e) => handlePriceChange('max', e.target.value)}
                    className="w-full pl-6 pr-2 py-2 rounded-xl bg-surface-100 border border-surface-200 text-xs font-extrabold text-surface-900 focus:outline-none focus:border-brand-500 focus:bg-white transition-all"
                    min="0"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stock Availability Segmented Control */}
      <div className="rounded-2xl border border-surface-200/60 bg-surface-50/50 p-3.5 space-y-3">
        <button
          type="button"
          onClick={() => toggleSection('availability')}
          className="w-full flex items-center justify-between text-left cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Package className="w-3.5 h-3.5 text-brand-500" />
            <h3 className="text-xs font-black uppercase tracking-wider text-surface-900">
              Availability
            </h3>
          </div>
          <ChevronDown
            className={`w-3.5 h-3.5 text-surface-400 transition-transform duration-200 ${
              collapsedSections.availability ? '-rotate-90' : ''
            }`}
          />
        </button>

        {!collapsedSections.availability && (
          <div className="pt-1">
            <div className="grid grid-cols-2 p-1 rounded-xl bg-surface-200/60 text-xs font-extrabold">
              <button
                type="button"
                onClick={() => handleInStockToggle(false)}
                className={`py-1.5 rounded-lg text-center transition-all cursor-pointer ${
                  !activeInStock
                    ? 'bg-white text-surface-900 shadow-xs'
                    : 'text-surface-600 hover:text-surface-900'
                }`}
              >
                All Items
              </button>
              <button
                type="button"
                onClick={() => handleInStockToggle(true)}
                className={`py-1.5 rounded-lg text-center transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  activeInStock
                    ? 'bg-brand-500 text-white shadow-xs'
                    : 'text-surface-600 hover:text-surface-900'
                }`}
              >
                <span>In Stock</span>
                {activeInStock && <Check className="w-3 h-3 stroke-[3]" />}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Floating Card Container */}
      <aside className="hidden lg:block w-64 shrink-0 p-5 rounded-3xl bg-surface-100 border border-surface-200/80 shadow-xs h-fit sticky top-24">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Slide-Over */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-surface-900/40 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />

          {/* Drawer Content */}
          <div className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-surface-100 p-6 shadow-2xl overflow-y-auto z-10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-surface-200/80">
                <div className="flex items-center gap-2 text-brand-500">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-xs font-black uppercase tracking-wider text-surface-900">
                    Filter Options
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onCloseMobile}
                  className="p-1.5 rounded-xl bg-surface-200/60 text-surface-700 hover:text-surface-900 transition-colors cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {sidebarContent}
            </div>

            {/* Mobile Bottom Action Button */}
            <div className="pt-4 border-t border-surface-200/80 mt-6">
              <button
                type="button"
                onClick={onCloseMobile}
                className="w-full py-3 rounded-2xl bg-surface-900 text-white font-black text-xs uppercase tracking-wider shadow-md active:scale-95 transition-transform cursor-pointer"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}