import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ShoppingBag, 
  Heart, 
  CheckCircle2, 
  XCircle, 
  Plus, 
  Minus, 
  ShieldCheck, 
  Truck, 
  RotateCcw,
  Sparkles,
  Tag,
  Star
} from 'lucide-react';
import { productService } from '../services/productService';
import { reviewService } from '../services/reviewService';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { getOptimizedImageUrl } from '../utils/cloudinary';

import ProductGrid from '../common/ProductGrid';
import RatingStars from '../common/RatingStars';
import Loader from '../common/Loader';
import ErrorMessage from '../common/ErrorMessage';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  // Review states (Display only)
  const [reviews, setReviews] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { addToCart } = useCart();
  const { wishlistItems, toggleWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();

  const isWishlisted = useMemo(() => {
    return isInWishlist(id) || wishlistItems.some((item) => (item._id || item.id) === id);
  }, [wishlistItems, id, isInWishlist]);

  const wishlistedIds = useMemo(() => {
    return wishlistItems.map((item) => item._id || item.id);
  }, [wishlistItems]);

  const extractImageUrl = (img) => {
    if (!img) return null;
    if (typeof img === 'string') return img;
    if (typeof img === 'object' && img.url) return img.url;
    return null;
  };

  useEffect(() => {
    let isMounted = true;
    const fetchProductDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);
        setQuantity(1);

        const res = await productService.getProductById(id);
        const fetchedProduct = res?.data || res;

        if (isMounted) {
          if (!fetchedProduct) {
            setError('Product not found.');
            return;
          }

          setProduct(fetchedProduct);

          const rawImages = Array.isArray(fetchedProduct.images) && fetchedProduct.images.length > 0
            ? fetchedProduct.images.map(extractImageUrl).filter(Boolean)
            : [];

          const primaryUrl = extractImageUrl(fetchedProduct.primaryImage) || extractImageUrl(fetchedProduct.image);
          const initialImage = primaryUrl || rawImages[0] || '/placeholder-product.png';

          setSelectedImage(initialImage);

          // Fetch product reviews safely with robust array extraction
          try {
            const revRes = await reviewService.getReviews(id);
            const fetchedReviews = Array.isArray(revRes) 
              ? revRes 
              : (Array.isArray(revRes?.data) ? revRes.data : (Array.isArray(revRes?.data?.data) ? revRes.data.data : []));
            setReviews(fetchedReviews);
          } catch (revErr) {
            console.error('Failed fetching reviews:', revErr);
          }

          // Fetch related products dynamically by category
          const categoryId = fetchedProduct.category?._id || fetchedProduct.category;
          if (categoryId) {
            try {
              const relRes = await productService.getProducts({ category: categoryId, limit: 4 });
              const related = relRes?.products || relRes?.data || [];
              setRelatedProducts(related.filter((p) => (p._id || p.id) !== id));
            } catch (rErr) {
              console.error('Failed fetching related products:', rErr);
            }
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err.response?.data?.message || err.message || 'Unable to load product details.');
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchProductDetails();
    return () => { isMounted = false; };
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    await addToCart(product, quantity);
  };

  const handleToggleWishlist = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    await toggleWishlist(product);
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-surface-50">
        <Loader text="Loading product specifications..." />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <ErrorMessage 
          message={error || 'Product not found.'} 
          onRetry={() => navigate('/products')} 
        />
        <div className="text-center mt-6">
          <Link 
            to="/products" 
            className="inline-flex items-center gap-2 text-xs font-bold text-brand-500 hover:text-brand-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Product Catalog
          </Link>
        </div>
      </div>
    );
  }

  const rawList = Array.isArray(product.images) && product.images.length > 0
    ? product.images.map(extractImageUrl).filter(Boolean)
    : [extractImageUrl(product.primaryImage) || extractImageUrl(product.image) || '/placeholder-product.png'];

  const imagesList = Array.from(new Set(rawList));
  const stockAvailable = product.stock !== undefined ? product.stock > 0 : (product.inStock ?? true);
  const maxAllowedQty = product.stock || 10;
  
  const hasDiscount = product.discountPrice || product.originalPrice;
  const originalPriceVal = Number(product.discountPrice || product.originalPrice || 0);
  const currentPriceVal = Number(product.price || 0);
  const discountPercent = (hasDiscount && originalPriceVal > currentPriceVal)
    ? Math.round(((originalPriceVal - currentPriceVal) / originalPriceVal) * 100)
    : 0;

  const reviewCount = reviews.length > 0 ? reviews.length : (product.numReviews || product.reviewCount || product.reviewsCount || 0);
  const ratingVal = product.rating || product.ratings || 0;

  const categoryName = typeof product.category === 'object' ? product.category?.name : product.category;

  return (
    <div className="min-h-screen bg-surface-50 text-surface-900 py-6 sm:py-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8 flex items-center justify-between">
          <Link 
            to="/products"
            className="group relative inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-surface-100 border border-surface-200 text-surface-800 text-xs font-black uppercase tracking-wider shadow-sm hover:shadow-md hover:border-brand-500/50 hover:text-brand-500 transition-all duration-300 transform hover:-translate-x-1 overflow-hidden"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-brand-50/50 via-tealAccent-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
            <span className="relative z-10">Back to Catalog</span>
          </Link>
        </div>

        <div className="bg-surface-100 rounded-3xl border border-surface-200/80 shadow-xl p-6 sm:p-8 lg:p-12 mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-gradient-to-br from-brand-100/40 to-tealAccent-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 relative z-10">
            <div className="lg:col-span-6 space-y-4">
              <div className="relative aspect-square w-full rounded-2xl bg-surface-50 border border-surface-200/80 overflow-hidden group shadow-inner flex items-center justify-center p-4">
                <img 
                  src={getOptimizedImageUrl(selectedImage, { width: 800 })} 
                  alt={product.name}
                  className="w-full h-full object-contain object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/placeholder-product.png';
                  }}
                />

                <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                  {stockAvailable ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 text-[11px] font-black uppercase tracking-wider backdrop-blur-md shadow-xs">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      In Stock
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-700 border border-rose-500/20 text-[11px] font-black uppercase tracking-wider backdrop-blur-md shadow-xs">
                      <XCircle className="w-3.5 h-3.5 text-rose-600" />
                      Out of Stock
                    </span>
                  )}

                  {discountPercent > 0 && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-500 text-white font-black text-[10px] uppercase tracking-wider shadow-md shadow-rose-500/20">
                      -{discountPercent}% OFF
                    </span>
                  )}
                </div>
              </div>

              {imagesList.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                  {imagesList.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(imgUrl)}
                      className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 flex-shrink-0 bg-surface-50 p-1 cursor-pointer ${
                        selectedImage === imgUrl 
                          ? 'border-brand-500 ring-2 ring-brand-500/20 scale-95 shadow-md' 
                          : 'border-surface-200 hover:border-brand-500/50 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img 
                        src={getOptimizedImageUrl(imgUrl, { width: 150 })} 
                        alt={`${product.name} thumbnail ${idx + 1}`} 
                        className="w-full h-full object-contain" 
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  {categoryName && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-brand-500 bg-brand-50 border border-brand-100 px-3 py-1 rounded-lg">
                      <Tag className="w-3 h-3" />
                      {categoryName}
                    </span>
                  )}
                  {product.brand && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-surface-800 uppercase tracking-wider bg-surface-200/50 px-3 py-1 rounded-lg">
                      Brand: <strong className="text-surface-900 font-black">{product.brand}</strong>
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-surface-900 tracking-tight leading-snug">
                  {product.name}
                </h1>

                <div className="flex items-center gap-3 pt-1">
                  {reviewCount > 0 || ratingVal > 0 ? (
                    <>
                      <RatingStars rating={ratingVal} />
                      <span className="text-xs font-bold text-surface-800">
                        ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
                      </span>
                    </>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold text-surface-800 bg-surface-200/40 px-2.5 py-1 rounded-md">
                      <Star className="w-3.5 h-3.5 text-surface-800/40" />
                      <span>No reviews yet</span>
                    </div>
                  )}
                </div>

                <div className="flex items-baseline gap-3 pt-2">
                  <span className="text-3xl sm:text-4xl font-black text-surface-900 tracking-tight">
                    ${currentPriceVal.toFixed(2)}
                  </span>
                  {hasDiscount && originalPriceVal > currentPriceVal && (
                    <span className="text-lg font-extrabold text-surface-800/50 line-through">
                      ${originalPriceVal.toFixed(2)}
                    </span>
                  )}
                </div>

                {product.description && (
                  <p className="text-xs sm:text-sm font-medium text-surface-800 leading-relaxed pt-2 border-t border-surface-200/60">
                    {product.description}
                  </p>
                )}
              </div>

              <div className="pt-6 border-t border-surface-200/80 space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-surface-900">
                    Quantity
                  </span>
                  
                  <div className="flex items-center gap-3">
                    <div className="inline-flex items-center rounded-2xl border border-surface-200 bg-surface-50 p-1 shadow-inner">
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        disabled={quantity <= 1 || !stockAvailable}
                        className="p-2 rounded-xl text-surface-800 hover:bg-surface-200 disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      
                      <span className="w-10 text-center font-black text-xs sm:text-sm text-surface-900">
                        {quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.min(maxAllowedQty, q + 1))}
                        disabled={quantity >= maxAllowedQty || !stockAvailable}
                        className="p-2 rounded-xl text-surface-800 hover:bg-surface-200 disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {product.stock !== undefined && (
                      <span className="text-[11px] font-bold text-surface-800">
                        ({product.stock} available)
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={!stockAvailable}
                    className={`flex-1 py-4 px-6 rounded-2xl font-black text-xs uppercase tracking-wider transition-all duration-300 shadow-md active:scale-95 flex items-center justify-center gap-2.5 cursor-pointer ${
                      stockAvailable 
                        ? 'bg-gradient-to-r from-brand-500 to-tealAccent-500 hover:from-brand-600 hover:to-tealAccent-500 text-white shadow-brand-500/25 hover:shadow-lg hover:shadow-brand-500/30' 
                        : 'bg-surface-200 text-surface-800/40 cursor-not-allowed shadow-none'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>{stockAvailable ? 'Add To Cart' : 'Out of Stock'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleToggleWishlist}
                    className={`p-4 rounded-2xl border transition-all duration-300 active:scale-90 cursor-pointer shadow-sm ${
                      isWishlisted
                        ? 'border-rose-500 bg-rose-50 text-rose-500 shadow-rose-500/10'
                        : 'border-surface-200 bg-surface-50 text-surface-800 hover:text-surface-900 hover:border-surface-300 hover:bg-surface-100'
                    }`}
                    aria-label="Toggle Wishlist"
                  >
                    <Heart className={`w-5 h-5 transition-transform duration-300 ${isWishlisted ? 'fill-rose-500 text-rose-500 scale-110' : ''}`} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-surface-200/60 text-center">
                <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-surface-50/50">
                  <Truck className="w-4 h-4 text-brand-500" />
                  <span className="text-[10px] font-extrabold text-surface-900 uppercase tracking-wider">Fast Delivery</span>
                </div>
                <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-surface-50/50">
                  <ShieldCheck className="w-4 h-4 text-tealAccent-500" />
                  <span className="text-[10px] font-extrabold text-surface-900 uppercase tracking-wider">Verified Authentic</span>
                </div>
                <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-surface-50/50">
                  <RotateCcw className="w-4 h-4 text-brand-500" />
                  <span className="text-[10px] font-extrabold text-surface-900 uppercase tracking-wider">Easy Returns</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabbed Specs, Details & Reviews Feed Section */}
          <div className="mt-12 pt-8 border-t border-surface-200/80">
            <div className="flex items-center gap-8 border-b border-surface-200/80 mb-6 overflow-x-auto scrollbar-none">
              <button
                type="button"
                onClick={() => setActiveTab('description')}
                className={`pb-3 font-black text-xs uppercase tracking-wider transition-all relative cursor-pointer whitespace-nowrap ${
                  activeTab === 'description'
                    ? 'text-brand-500 border-b-2 border-brand-500'
                    : 'text-surface-800 hover:text-surface-900'
                }`}
              >
                Product Description
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('specs')}
                className={`pb-3 font-black text-xs uppercase tracking-wider transition-all relative cursor-pointer whitespace-nowrap ${
                  activeTab === 'specs'
                    ? 'text-brand-500 border-b-2 border-brand-500'
                    : 'text-surface-800 hover:text-surface-900'
                }`}
              >
                Specifications
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('reviews')}
                className={`pb-3 font-black text-xs uppercase tracking-wider transition-all relative cursor-pointer whitespace-nowrap ${
                  activeTab === 'reviews'
                    ? 'text-brand-500 border-b-2 border-brand-500'
                    : 'text-surface-800 hover:text-surface-900'
                }`}
              >
                Customer Reviews ({reviews.length})
              </button>
            </div>

            {activeTab === 'description' && (
              <div className="text-xs sm:text-sm font-medium text-surface-800 leading-relaxed max-w-4xl bg-surface-50/60 p-6 rounded-2xl border border-surface-200/50">
                {product.description || 'No detailed description available for this product.'}
              </div>
            )} 

            {activeTab === 'specs' && (
              <div className="max-w-2xl bg-surface-50/60 p-6 rounded-2xl border border-surface-200/50">
                <table className="w-full text-xs text-left border-collapse">
                  <tbody>
                    <tr className="border-b border-surface-200/60">
                      <td className="py-3 font-bold text-surface-800 uppercase tracking-wider">Brand</td>
                      <td className="py-3 font-black text-surface-900">{product.brand || 'Generic'}</td>
                    </tr>
                    <tr className="border-b border-surface-200/60">
                      <td className="py-3 font-bold text-surface-800 uppercase tracking-wider">Category</td>
                      <td className="py-3 font-black text-surface-900">{categoryName || 'General'}</td>
                    </tr>
                    <tr className="border-b border-surface-200/60">
                      <td className="py-3 font-bold text-surface-800 uppercase tracking-wider">Product SKU / ID</td>
                      <td className="py-3 font-mono font-extrabold text-surface-900">{product._id || product.id}</td>
                    </tr>
                    <tr>
                      <td className="py-3 font-bold text-surface-800 uppercase tracking-wider">Availability Status</td>
                      <td className="py-3 font-black text-emerald-600">
                        {stockAvailable ? `In Stock (${product.stock || 'Available'})` : 'Out of Stock'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="max-w-4xl space-y-4">
                <h3 className="text-sm font-black text-surface-900 uppercase tracking-wider">
                  Verified Customer Reviews ({reviews.length})
                </h3>
                {reviews.length === 0 ? (
                  <p className="text-xs font-medium text-surface-800/60 italic bg-surface-50/40 p-4 rounded-xl border border-surface-200/40">
                    No approved reviews yet for this product.
                  </p>
                ) : (
                  reviews.map((rev) => {
                    const reviewId = rev._id || rev.id;
                    const userName = rev.user?.name || rev.userName || 'Verified Customer';
                    const revDate = rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : '';
                    const reviewMessage = rev.comment || rev.reviewMessage || '';
                    
                    return (
                      <div key={reviewId} className="bg-surface-50/60 p-5 rounded-2xl border border-surface-200/50 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="font-black text-xs text-surface-900">{userName}</span>
                            <span className="text-[10px] font-bold text-surface-800/50">{revDate}</span>
                          </div>
                          <RatingStars rating={rev.rating} />
                        </div>
                        <p className="text-xs font-medium text-surface-800 leading-relaxed">
                          {reviewMessage}
                        </p>
                        {rev.image && (
                          <div className="mt-2">
                            <img src={rev.image} alt="Review attachment" className="w-20 h-20 object-cover rounded-xl border border-surface-200" />
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>

        </div>

        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-brand-500" />
              <h2 className="text-xl sm:text-2xl font-black text-surface-900 tracking-tight">
                You Might Also Like
              </h2>
            </div>
            <ProductGrid 
              products={relatedProducts} 
              onAddToCart={addToCart}
              wishlistedIds={wishlistedIds}
              onToggleWishlist={toggleWishlist}
            />
          </section>
        )}

      </div>
    </div>
  );
}