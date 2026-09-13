import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Flame, 
  ArrowRight, 
  Sparkles,
  Compass
} from 'lucide-react';
import ProductCard from '../../common/ProductCard';
import productService from '../../services/productService';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export default function TrendingProductsSection() {
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { addToCart } = useCart();
  const { wishlistItems, toggleWishlist } = useWishlist();
  const wishlistedIds = wishlistItems ? wishlistItems.map((item) => item._id || item.id) : [];

  useEffect(() => {
    let isMounted = true;

    const fetchTrending = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const res = await productService.getProducts({ limit: 20 });

        if (isMounted) {
          let list = res?.products || res?.data?.products || (Array.isArray(res) ? res : []);

          // Sort by review count (most reviewed products first)
          const sortedByReviews = list.sort((a, b) => {
            const countA = Number(a.numReviews || a.reviewsCount || a.reviews?.length || 0);
            const countB = Number(b.numReviews || b.reviewsCount || b.reviews?.length || 0);
            return countB - countA;
          });

          // Take top 4 products
          setTrendingProducts(sortedByReviews.slice(0, 4));
        }
      } catch (err) {
        if (isMounted) {
          console.error('Failed to load trending products:', err);
          setError('Could not load products at this moment.');
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchTrending();
    return () => {
      isMounted = false;
    };
  }, []);

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
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 15px rgba(6, 182, 212, 0.4); }
          50% { box-shadow: 0 0 25px rgba(99, 102, 241, 0.8); }
        }
        .animate-text-shimmer {
          background-size: 200% auto;
          animation: headerGlow 6s ease infinite;
        }
        .animate-float-slow {
          animation: floatSlow 4s ease-in-out infinite;
        }
        .animate-pulse-glow {
          animation: pulseGlow 3s infinite;
        }
        .trending-grid-wrapper [class*="text-surface-400"],
        .trending-grid-wrapper [class*="text-surface-500"],
        .trending-grid-wrapper [class*="text-gray-400"] {
          color: #475569 !important;
          font-weight: 700 !important;
        }
        .trending-grid-wrapper [class*="text-surface-300"] {
          color: #64748b !important;
        }
      `}</style>

      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50rem] h-[25rem] bg-cyan-500/10 rounded-full blur-[130px]" />
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle, #0f172a 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 pb-6 border-b border-slate-200/70">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-700 text-[11px] font-black uppercase tracking-wider shadow-xs backdrop-blur-md animate-float-slow">
              <Flame className="w-3.5 h-3.5 text-cyan-600 animate-pulse" />
              <span>Most Reviewed Favorites</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Trending{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 animate-text-shimmer">
                Products
              </span>
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-slate-600">
              Discover top picks with the highest community engagement and reviews.
            </p>
          </div>

          <Link
            to="/products"
            className="group relative inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 text-white text-xs font-black uppercase tracking-wider shadow-lg animate-pulse-glow hover:scale-105 active:scale-95 transition-all duration-300 overflow-hidden cursor-pointer w-full md:w-auto justify-center"
          >
            <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <Compass className="w-4 h-4 text-cyan-200 group-hover:rotate-45 transition-transform duration-500 relative z-10" />
            <span className="relative z-10">Explore All Items</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform relative z-10" />
          </Link>
        </div>

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

        {error && !isLoading && (
          <div className="p-6 rounded-3xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold text-center shadow-xs">
            {error}
          </div>
        )}

        {!isLoading && !error && trendingProducts.length > 0 && (
          <div className="trending-grid-wrapper grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {trendingProducts.map((product) => (
              <div key={product._id || product.id} className="w-full">
                <ProductCard
                  product={product}
                  onAddToCart={addToCart}
                  isWishlisted={wishlistedIds.includes(product._id || product.id)}
                  onToggleWishlist={() => toggleWishlist(product)}
                />
              </div>
            ))}
          </div>
        )}

        {!isLoading && !error && trendingProducts.length === 0 && (
          <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 shadow-xs">
            <Sparkles className="w-8 h-8 text-slate-400 mx-auto mb-2 animate-bounce" />
            <p className="text-slate-700 font-extrabold text-sm">
              No trending products found right now.
            </p>
          </div>
        )}

      </div>
    </section>
  );
}