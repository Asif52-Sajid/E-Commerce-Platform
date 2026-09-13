import React, { useEffect, useState, useRef } from 'react';
import { Compass, RefreshCw, Sparkles, Star, Sparkle, Tag } from 'lucide-react';
import ProductCard from '../../common/ProductCard';
import productService from '../../services/productService';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const DISCOVERY_FILTERS = [
  { id: 'top_rated', label: '⭐ Top Rated', icon: Star, params: { sort: 'rating' } },
  { id: 'new_arrivals', label: '🆕 Just Arrived', icon: Sparkle, params: { sort: 'newest' } },
  { id: 'best_deals', label: '💰 Best Deals', icon: Tag, params: { sort: 'discount' } },
];

export default function DiscoverySection() {
  const [activeFilterId, setActiveFilterId] = useState('top_rated');
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const totalPagesRef = useRef(1);

  const { addToCart } = useCart();
  const { wishlistItems, toggleWishlist } = useWishlist();
  const wishlistedIds = wishlistItems ? wishlistItems.map((item) => item._id || item.id) : [];

  const fetchDiscoveryProducts = async (filterId = activeFilterId, shuffle = false) => {
    try {
      if (shuffle) setIsRefreshing(true);
      else setIsLoading(true);
      setError(null);

      const activeFilter = DISCOVERY_FILTERS.find((f) => f.id === filterId) || DISCOVERY_FILTERS[0];
      
      const params = {
        limit: 8,
        ...activeFilter.params,
      };

      if (shuffle && totalPagesRef.current > 1) {
        params.page = Math.floor(Math.random() * totalPagesRef.current) + 1;
      } else {
        params.page = 1;
      }

      const response = await productService.getProducts(params);
      
      let productList = response?.products || response?.data?.products || (Array.isArray(response) ? response : []);

      const totalPages = response?.pagination?.totalPages || response?.data?.pagination?.totalPages || 1;
      totalPagesRef.current = totalPages;

      setProducts(productList.slice(0, 4));
    } catch (err) {
      console.error('Error fetching discovery products:', err);
      setError('Failed to load discovery products.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDiscoveryProducts(activeFilterId, false);
  }, [activeFilterId]);

  const handleShuffle = () => {
    fetchDiscoveryProducts(activeFilterId, true);
  };

  return (
    <section className="py-16 bg-white border-b border-slate-200/80 relative overflow-hidden select-none">
      <style>{`
        @keyframes headerGlow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        .animate-text-shimmer {
          background-size: 200% auto;
          animation: headerGlow 6s ease infinite;
        }
        .animate-float-slow {
          animation: floatSlow 4s ease-in-out infinite;
        }

        .discovery-grid-wrapper [class*="text-surface-400"],
        .discovery-grid-wrapper [class*="text-surface-500"],
        .discovery-grid-wrapper [class*="text-gray-400"] {
          color: #475569 !important;
          font-weight: 700 !important;
        }
        .discovery-grid-wrapper [class*="text-surface-300"] {
          color: #64748b !important;
        }
      `}</style>

      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[45rem] h-[22rem] bg-cyan-500/10 rounded-full blur-[120px]" />
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle, #0f172a 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6 pb-6 border-b border-slate-200/70">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-700 text-[11px] font-black uppercase tracking-wider shadow-xs backdrop-blur-md animate-float-slow">
              <Compass className="w-3.5 h-3.5 text-cyan-600 animate-spin-slow" />
              <span>Smart Matcher</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Discover{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 animate-text-shimmer">
                Something New
              </span>
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-slate-600">
              Explore hand-picked items tuned to your favorite vibes and collections.
            </p>
          </div>

          <button
            onClick={handleShuffle}
            disabled={isRefreshing || isLoading}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-cyan-600 text-white font-extrabold text-xs transition-all duration-300 shadow-md hover:shadow-cyan-500/20 active:scale-95 disabled:opacity-50 cursor-pointer w-fit"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Shuffle Recommendations</span>
          </button>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {DISCOVERY_FILTERS.map((filter) => {
            const isActive = activeFilterId === filter.id;

            return (
              <button
                key={filter.id}
                onClick={() => setActiveFilterId(filter.id)}
                className={`px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm scale-[1.02]'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80 border border-slate-200'
                }`}
              >
                <span>{filter.label}</span>
              </button>
            );
          })}
        </div>

        {/* Loading Skeletons */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div 
                key={idx} 
                className="h-96 rounded-3xl bg-white border border-slate-200 p-4 animate-pulse flex flex-col justify-between shadow-xs"
              >
                <div className="w-full h-52 rounded-2xl bg-slate-100" />
                <div className="space-y-3 mt-4">
                  <div className="h-4 w-3/4 rounded bg-slate-200" />
                  <div className="h-3 w-1/2 rounded bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error Feedback */}
        {error && !isLoading && (
          <div className="p-6 rounded-3xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold text-center shadow-xs">
            {error}
          </div>
        )}

        {/* Product Grid */}
        {!isLoading && !error && products.length > 0 && (
          <div className="discovery-grid-wrapper grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product._id || product.id}
                product={product}
                onAddToCart={addToCart}
                isWishlisted={wishlistedIds.includes(product._id || product.id)}
                onToggleWishlist={() => toggleWishlist(product)}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && products.length === 0 && (
          <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 shadow-xs">
            <Sparkles className="w-8 h-8 text-slate-400 mx-auto mb-2 animate-bounce" />
            <p className="text-slate-700 font-extrabold text-sm">
              No products match this vibe selection right now.
            </p>
          </div>
        )}

      </div>
    </section>
  );
}