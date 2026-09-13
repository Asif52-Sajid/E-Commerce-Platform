import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Eye, Sparkles, Star } from 'lucide-react';
import WishlistBadgeButton from './WishlistBadgeButton';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { getOptimizedImageUrl } from '../utils/cloudinary';

export default function ProductCard({ 
  product, 
  onAddToCart, 
  isWishlisted: propIsWishlisted, 
  onToggleWishlist 
}) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!product) return null;

  const {
    _id,
    id: altId,
    name,
    slug,
    price,
    originalPrice,
    rating = 0,
    numReviews = 0,
    reviewCount = 0,
    reviews = [],
    isNew = false,
    inStock,
    stock = 0,
  } = product;

  const totalReviews = numReviews || reviewCount || (Array.isArray(reviews) ? reviews.length : 0);

  const productId = _id || altId;
  const targetParam = slug || productId;
  const isWishlisted = propIsWishlisted !== undefined ? propIsWishlisted : isInWishlist(productId);
  const isAvailable = inStock !== undefined ? inStock : stock > 0;

  const getDisplayImage = () => {
    if (!product) return '/placeholder-product.png';
    if (product.primaryImage?.url) return product.primaryImage.url;
    if (Array.isArray(product.images) && product.images.length > 0) {
      const firstImg = product.images[0];
      return typeof firstImg === 'string' ? firstImg : firstImg?.url;
    }
    return product.image || '/placeholder-product.png';
  };

  const rawImageUrl = getDisplayImage();
  // Request responsive thumbnail width with Cloudinary auto formatting
  const imageUrl = getOptimizedImageUrl(rawImageUrl, { width: 400, quality: 'auto', format: 'auto' });

  const discountPercent = originalPrice && originalPrice > price
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const handleWishlistClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (onToggleWishlist) {
      onToggleWishlist(productId);
    } else {
      await toggleWishlist(product);
    }
  };

  const handleAddToCartClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (onAddToCart) {
      onAddToCart(product);
    } else {
      await addToCart(product, 1);
    }
  };

  const handleQuickViewClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    window.scrollTo(0, 0);
    navigate(`/products/${targetParam}`);
  };

  return (
    <div className="group relative bg-white border border-slate-200/90 hover:border-blue-500/50 rounded-3xl overflow-hidden flex flex-col shadow-xs hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 ease-out hover:-translate-y-1 w-full h-full select-none">
      
      <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
        <img
          src={imageUrl}
          alt={name}
          loading="lazy"
          className={`w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out ${
            !isAvailable ? 'opacity-50 grayscale' : ''
          }`}
        />

        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start z-10 pointer-events-none">
          {discountPercent > 0 && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-xl bg-rose-500 text-white font-black text-[10px] uppercase tracking-wider shadow-sm">
              -{discountPercent}%
            </span>
          )}
          {isNew && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-900 text-white font-black text-[10px] uppercase tracking-wider shadow-sm">
              <Sparkles className="w-2.5 h-2.5 text-blue-500" />
              New
            </span>
          )}
        </div>

        <div className="absolute top-3 right-3 z-20">
          <WishlistBadgeButton 
            count={isWishlisted ? 1 : 0} 
            onClick={handleWishlistClick} 
          />
        </div>

        <div className="absolute inset-x-4 bottom-4 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 hidden sm:block">
          <button
            type="button"
            onClick={handleQuickViewClick}
            className="w-full py-2.5 rounded-2xl bg-slate-900/95 hover:bg-slate-900 text-white font-extrabold text-xs uppercase tracking-wider backdrop-blur-md shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
          >
            <Eye className="w-4 h-4 text-blue-500" />
            <span>Quick View</span>
          </button>
        </div>

        {!isAvailable && (
          <div className="absolute inset-x-0 bottom-0 py-1.5 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest text-center border-t border-white/10 z-10">
            Out of Stock
          </div>
        )}
      </div>

      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-4 bg-white">
        <div className="space-y-2">
          <div className="min-h-[18px] flex items-center">
            {totalReviews > 0 ? (
              <div className="flex items-center gap-1.5">
                <div className="flex items-center text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                </div>
                <span className="text-xs font-black text-slate-900">
                  {Number(rating || 0).toFixed(1)}
                </span>
                <span className="text-[10px] font-bold text-slate-500">
                  ({totalReviews})
                </span>
              </div>
            ) : (
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                No reviews yet
              </span>
            )}
          </div>

          <Link 
            to={`/products/${targetParam}`} 
            onClick={() => window.scrollTo(0, 0)}
            className="block group/title focus:outline-none"
          >
            <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 group-hover/title:text-blue-600 transition-colors line-clamp-2 leading-snug">
              {name}
            </h3>
          </Link>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-auto">
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
              Price
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-black text-slate-900 tracking-tight">
                ${Number(price || 0).toFixed(2)}
              </span>
              {originalPrice > price && (
                <span className="text-xs font-bold text-slate-400 line-through">
                  ${Number(originalPrice).toFixed(2)}
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddToCartClick}
            disabled={!isAvailable}
            aria-label="Add to cart"
            className={`p-3 rounded-2xl transition-all duration-200 shadow-xs flex items-center justify-center cursor-pointer active:scale-95 ${
              isAvailable 
                ? 'bg-slate-900 hover:bg-blue-600 text-white' 
                : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}