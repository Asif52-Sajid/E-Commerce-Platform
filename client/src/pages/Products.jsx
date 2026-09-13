import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  SlidersHorizontal, 
  Tag, 
  X, 
  ArrowUpDown, 
  RotateCcw,
  Grid,
  Filter,
  Layers,
  ChevronDown
} from 'lucide-react';
import productService from '../services/productService';
import categoryService from '../services/categoryService';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

import ProductGrid from '../common/ProductGrid';
import FilterSidebar from '../common/FilterSidebar';
import SearchBar from '../common/SearchBar';
import Pagination from '../common/Pagination';
import Loader from '../common/Loader';
import ErrorMessage from '../common/ErrorMessage';
import EmptyState from '../common/EmptyState';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [paginationData, setPaginationData] = useState({ currentPage: 1, totalPages: 1, totalProducts: 0 });
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const { addToCart } = useCart();
  const { wishlistItems, toggleWishlist } = useWishlist();
  const wishlistedIds = useMemo(() => wishlistItems.map((item) => item._id || item.id), [wishlistItems]);

  // Extract clean query parameters including 'tag' from URL search params
  const queryParams = useMemo(() => {
    return {
      search: searchParams.get('search') || '',
      category: searchParams.get('category') || '',
      tag: searchParams.get('tag') || '',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      inStock: searchParams.get('inStock') === 'true',
      sort: searchParams.get('sort') || 'newest',
      page: Number(searchParams.get('page')) || 1,
      limit: 12,
    };
  }, [searchParams]);

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (queryParams.search) count++;
    if (queryParams.category) count++;
    if (queryParams.tag) count++;
    if (queryParams.minPrice || queryParams.maxPrice) count++;
    if (queryParams.inStock) count++;
    return count;
  }, [queryParams]);

  useEffect(() => {
    let isMounted = true;
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getCategories();
        if (isMounted) {
          setCategories(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    fetchCategories();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    let isMounted = true;
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const cleanParams = Object.fromEntries(
          Object.entries(queryParams).filter(([_, v]) => v !== '' && v !== false && v !== null)
        );

        const res = await productService.getProducts(cleanParams);
        const fetchedProducts = res?.products || res?.data || (Array.isArray(res) ? res : []);
        const pagination = res?.pagination || { 
          currentPage: queryParams.page, 
          totalPages: 1, 
          totalProducts: fetchedProducts.length 
        };

        if (isMounted) {
          setProducts(fetchedProducts);
          setPaginationData(pagination);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.response?.data?.message || err.message || 'Failed to load products. Please check your connection.');
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchProducts();
    return () => { isMounted = false; };
  }, [queryParams]);

  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value !== undefined && value !== '' && value !== false && value !== null) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    if (key !== 'page') {
      newParams.set('page', '1');
    }
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  // Find category display name from active ID/slug
  const selectedCategoryObj = useMemo(() => {
    if (!queryParams.category) return null;
    return categories.find(c => c._id === queryParams.category || c.slug === queryParams.category || c.name === queryParams.category);
  }, [categories, queryParams.category]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-6 sm:py-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Section */}
        <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-900/5 p-6 sm:p-10 overflow-hidden transition-all duration-500">
          
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-gradient-to-br from-blue-500/20 via-sky-400/10 to-transparent rounded-full blur-3xl pointer-events-none animate-pulse" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-gradient-to-tr from-blue-500/10 via-slate-200/30 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 relative z-10">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-600 font-black text-[10px] uppercase tracking-widest backdrop-blur-md transition-all duration-300 hover:bg-cyan-100">
                  <Layers className="w-3.5 h-3.5 text-cyan-600" />
                  Smart Matcher
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600">Something New</span>
              </h1>

              <p className="text-xs sm:text-sm font-bold text-slate-600 leading-relaxed">
                Explore hand-picked items tuned to your favorite vibes and collections.
              </p>
            </div>

            {/* Search Component Container */}
            <div className="w-full lg:w-[420px] transition-transform duration-300 hover:scale-[1.01]">
              <SearchBar />
            </div>
          </div>

          {/* Active Filters Pill Bar */}
          {activeFiltersCount > 0 && (
            <div className="mt-8 pt-5 border-t border-slate-200/80 flex flex-wrap items-center gap-2.5 animate-fadeIn">
              <span className="text-[11px] font-black uppercase tracking-widest text-slate-500 mr-2 flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-blue-600" /> Filtered By:
              </span>

              {queryParams.search && (
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/80 text-xs font-bold text-slate-900 shadow-xs transition-all duration-200 hover:border-blue-500/40">
                  Search: "<span className="text-blue-600 font-extrabold">{queryParams.search}</span>"
                  <button 
                    onClick={() => updateParam('search', '')} 
                    className="p-0.5 rounded-full hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {queryParams.tag && (
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-50 border border-cyan-200 text-xs font-black text-cyan-700 shadow-xs transition-all duration-200">
                  <Tag className="w-3 h-3" />
                  Tag: <span className="uppercase">{queryParams.tag}</span>
                  <button 
                    onClick={() => updateParam('tag', '')} 
                    className="p-0.5 rounded-full hover:bg-rose-500/10 text-cyan-700 hover:text-rose-500 transition-colors cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedCategoryObj && (
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-50 border border-cyan-200 text-xs font-black text-cyan-700 shadow-xs transition-all duration-200">
                  <Tag className="w-3 h-3" />
                  {selectedCategoryObj.name}
                  <button 
                    onClick={() => updateParam('category', '')} 
                    className="p-0.5 rounded-full hover:bg-rose-500/10 text-cyan-700 hover:text-rose-500 transition-colors cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {(queryParams.minPrice || queryParams.maxPrice) && (
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/80 text-xs font-bold text-slate-900 shadow-xs transition-all duration-200 hover:border-blue-500/40">
                  Price: ${queryParams.minPrice || '0'} - ${queryParams.maxPrice || '∞'}
                  <button 
                    onClick={() => { updateParam('minPrice', ''); updateParam('maxPrice', ''); }} 
                    className="p-0.5 rounded-full hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {queryParams.inStock && (
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-black text-emerald-700 shadow-xs transition-all duration-200">
                  In Stock Only
                  <button 
                    onClick={() => updateParam('inStock', false)} 
                    className="p-0.5 rounded-full hover:bg-rose-500/10 text-emerald-700 hover:text-rose-500 transition-colors cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider text-rose-500 hover:bg-rose-500/10 transition-all duration-200 cursor-pointer ml-auto active:scale-95"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Layout Grid */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Desktop & Mobile Filter Sidebar */}
          <FilterSidebar 
            categories={categories}
            filters={queryParams}
            onFilterChange={updateParam}
            onReset={handleResetFilters}
            isOpen={isMobileFilterOpen}
            onCloseMobile={() => setIsMobileFilterOpen(false)}
          />

          {/* Mobile Quick Toolbar */}
          <div className="lg:hidden w-full flex items-center justify-between gap-3">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="relative flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-white border border-slate-200/80 font-extrabold text-xs text-slate-900 shadow-xs active:scale-95 transition-all duration-200"
            >
              <SlidersHorizontal className="w-4 h-4 text-blue-600" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-black flex items-center justify-center animate-bounce">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            <div className="relative">
              <select
                value={queryParams.sort}
                onChange={(e) => updateParam('sort', e.target.value)}
                className="px-4 py-3.5 rounded-2xl bg-white border border-slate-200/80 text-xs font-extrabold text-slate-900 focus:outline-none appearance-none shadow-xs cursor-pointer pr-10 transition-all duration-200 focus:border-blue-600"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-500 pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Main Content Area */}
          <main className="flex-1 w-full space-y-6">
            
            {/* Desktop Control Toolbar */}
            <div className="hidden lg:flex items-center justify-between p-4 rounded-2xl bg-white/90 border border-slate-200/80 shadow-xs backdrop-blur-md">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-cyan-50 text-cyan-600">
                  <Grid className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-600">
                  Showing <strong className="text-slate-900 font-black">{products.length}</strong> of <strong className="text-slate-900 font-black">{paginationData.totalProducts}</strong> products
                </span>
              </div>

              {/* Sort Dropdown Controller */}
              <div className="flex items-center gap-3">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <ArrowUpDown className="w-3.5 h-3.5 text-blue-600" /> Sort By:
                </label>
                <div className="relative">
                  <select
                    value={queryParams.sort}
                    onChange={(e) => updateParam('sort', e.target.value)}
                    className="px-4 py-2.5 pr-9 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-extrabold text-slate-900 focus:outline-none focus:border-blue-600/60 hover:border-slate-300 transition-all duration-200 cursor-pointer appearance-none shadow-2xs"
                  >
                    <option value="newest">Newest Arrivals</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            {/* View States */}
            {isLoading && (
              <div className="py-24 flex justify-center items-center bg-white/80 rounded-3xl border border-slate-200/80 shadow-xs backdrop-blur-sm">
                <Loader text="Fetching product catalog..." />
              </div>
            )}

            {error && !isLoading && (
              <div className="p-8 bg-white/80 rounded-3xl border border-slate-200/80 shadow-xs">
                <ErrorMessage 
                  message={error} 
                  onRetry={() => setSearchParams(new URLSearchParams(searchParams))} 
                />
              </div>
            )}

            {!isLoading && !error && products.length === 0 && (
              <div className="p-12 bg-white/80 rounded-3xl border border-slate-200/80 shadow-xs text-center">
                <EmptyState 
                  title="No Products Match Your Criteria"
                  description="Try broadening your search term, clearing price limits, or selecting a different tag/category."
                  onReset={handleResetFilters}
                />
              </div>
            )}

            {!isLoading && !error && products.length > 0 && (
              <div className="space-y-8 animate-fadeIn">
                <ProductGrid 
                  products={products}
                  onAddToCart={addToCart}
                  wishlistedIds={wishlistedIds}
                  onToggleWishlist={toggleWishlist}
                />

                {paginationData.totalPages > 1 && (
                  <div className="mt-12 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-slate-200/80 shadow-xs flex justify-center">
                    <Pagination 
                      currentPage={paginationData.currentPage}
                      totalPages={paginationData.totalPages}
                      onPageChange={(p) => updateParam('page', p)}
                    />
                  </div>
                )}
              </div>
            )}

          </main>
        </div>

      </div>
    </div>
  );
}