import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Star, ShoppingBag, Eye } from 'lucide-react';
import ProductCard from '../../common/ProductCard';
import productService from '../../services/productService';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export default function FeaturedProductsSection() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { addToCart } = useCart();
  const { wishlistItems, toggleWishlist } = useWishlist();

  const wishlistedIds = wishlistItems.map((item) => item._id || item.id);

  useEffect(() => {
    let isMounted = true;
    const fetchFeatured = async () => {
      try {
        setIsLoading(true);
        setError(null);

        let data;
        try {
          // Attempt specific featured endpoint
          data = await productService.getFeaturedProducts();
        } catch {
          // Fallback to standard query with featured=true filter
          data = await productService.getProducts({ featured: 'true' });
        }

        if (isMounted) {
          const list = Array.isArray(data) ? data : data?.products || [];
          
          // Ensure items match featured criteria (or take top list if all pass)
          const filtered = list.filter((p) => p.featured === true || p.featured === 'true');
          setFeaturedProducts(filtered.length > 0 ? filtered : list);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Failed to load featured products:', err);
          setError('Could not load featured products.');
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchFeatured();
    return () => {
      isMounted = false;
    };
  }, []);

  if (!isLoading && !error && featuredProducts.length === 0) {
    return null;
  }

  const flagshipProduct = featuredProducts[0];
  const gridProducts = featuredProducts.slice(1, 4);

  return (
    <section className="py-20 bg-surface-100/50 border-b border-surface-200/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 text-xs font-black uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Curated Selection</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-surface-900 tracking-tight">
              Featured right now
            </h2>
            <p className="text-sm font-medium text-surface-600 mt-1">
              Products worth taking a closer look at.
            </p>
          </div>

          <Link
            to="/products?featured=true"
            className="inline-flex items-center gap-2 text-xs font-extrabold text-brand-600 hover:text-brand-700 transition-colors group"
          >
            <span>Explore All Featured</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Loading Skeletons */}
        {isLoading && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 h-96 rounded-3xl bg-surface-200/70 animate-pulse" />
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="h-96 rounded-2xl bg-surface-200/70 animate-pulse" />
              <div className="h-96 rounded-2xl bg-surface-200/70 animate-pulse" />
              <div className="h-96 rounded-2xl bg-surface-200/70 animate-pulse" />
            </div>
          </div>
        )}

        {/* Error Fallback */}
        {error && !isLoading && (
          <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold text-center">
            {error}
          </div>
        )}

        {/* Editorial Layout */}
        {!isLoading && !error && featuredProducts.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Flagship Showcase Card */}
            {flagshipProduct && (
              <div className="lg:col-span-5 group relative rounded-3xl bg-surface-100 border border-surface-200/90 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col justify-between">
                
                <div className="relative aspect-[4/3] lg:aspect-square w-full overflow-hidden bg-surface-200/50">
                  <img
                    src={
                      typeof flagshipProduct.images?.[0] === 'string'
                        ? flagshipProduct.images[0]
                        : flagshipProduct.images?.[0]?.url || 'https://via.placeholder.com/600x600?text=Featured+Product'
                    }
                    alt={flagshipProduct.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  
                  <div className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-xl bg-brand-500 text-white font-black text-xs tracking-wide shadow-md">
                    Top Editor Pick
                  </div>
                </div>

                <div className="p-6 flex flex-col justify-between gap-4 flex-1">
                  <div>
                    <div className="flex items-center gap-1.5 text-amber-500 text-xs font-bold mb-2">
                      <Star className="w-4 h-4 fill-amber-500" />
                      <span>{flagshipProduct.rating || 4.9} Exceptional Choice</span>
                    </div>

                    <h3 className="text-xl font-extrabold text-surface-900 group-hover:text-brand-500 transition-colors line-clamp-2">
                      {flagshipProduct.name}
                    </h3>
                    <p className="text-xs text-surface-600 font-medium line-clamp-2 mt-2 leading-relaxed">
                      {flagshipProduct.description || 'Premium craftsmanship meets high-performance modern design.'}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-surface-200/80">
                    <div>
                      <span className="text-xs text-surface-500 font-bold block uppercase tracking-wider">Price</span>
                      <span className="text-xl font-black text-surface-900">
                        ${Number(flagshipProduct.price).toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/products/${flagshipProduct.slug || flagshipProduct._id}`}
                        className="p-3 rounded-xl bg-surface-200 hover:bg-surface-300 text-surface-800 transition-colors"
                        aria-label="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>

                      <button
                        onClick={() => addToCart(flagshipProduct)}
                        className="px-4 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-md shadow-brand-500/20 active:scale-95 transition-all flex items-center gap-2"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Grid Columns */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {gridProducts.map((product) => (
                <ProductCard
                  key={product._id || product.id}
                  product={product}
                  onAddToCart={addToCart}
                  isWishlisted={wishlistedIds.includes(product._id || product.id)}
                  onToggleWishlist={() => toggleWishlist(product)}
                />
              ))}
            </div>

          </div>
        )}

      </div>
    </section>
  );
}