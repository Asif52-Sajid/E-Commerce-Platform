import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { Heart, Trash2, ArrowRight, Sparkles, ShoppingCart } from 'lucide-react';

export default function Wishlist() {
  const { wishlistItems, removeFromWishlist, clearWishlist, loading } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = async (product) => {
    await addToCart(product, 1);
    await removeFromWishlist(product._id);
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-slate-50 flex flex-col items-center justify-center p-6 text-slate-800 select-none">
        <div className="relative flex items-center justify-center mb-4">
          <div className="w-12 h-12 rounded-full border-4 border-cyan-500/20 border-t-cyan-500 animate-spin" />
          <Heart className="w-5 h-5 text-cyan-600 absolute" />
        </div>
        <p className="text-xs font-black uppercase tracking-widest text-slate-600 animate-pulse">
          Loading Saved Wishlist...
        </p>
      </div>
    );
  }

  if (!wishlistItems || wishlistItems.length === 0) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-slate-50 flex items-center justify-center p-6 select-none">
        <div className="max-w-md w-full text-center bg-white border border-slate-200/80 rounded-3xl p-8 sm:p-10 shadow-xl shadow-slate-900/5 animate-in fade-in zoom-in-95 duration-300">
          <div className="relative w-24 h-24 bg-gradient-to-br from-cyan-500/10 via-blue-600/10 to-cyan-500/20 border border-cyan-500/30 rounded-3xl flex items-center justify-center mx-auto mb-6 text-cyan-600 shadow-inner group">
            <Heart className="w-10 h-10 group-hover:scale-110 transition-transform duration-300" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500 border-2 border-white" />
            </span>
          </div>

          <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
            Your Wishlist is Empty
          </h2>
          <p className="text-xs font-semibold text-slate-600 leading-relaxed mb-8">
            Save items you like to view them later or move them directly to your cart whenever you are ready.
          </p>

          <Link
            to="/products"
            className="group relative inline-flex items-center justify-center gap-2.5 w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/25 transition-all duration-300 active:scale-95 overflow-hidden cursor-pointer"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
            <span>Browse Products</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-80px)] text-slate-900 py-10 px-4 sm:px-6 lg:px-8 select-none">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-200/80">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-cyan-700 text-[10px] font-black uppercase tracking-widest mb-1">
              <Sparkles className="w-3 h-3 text-cyan-600" />
              <span>Saved Items</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Saved Wishlist <span className="text-sm font-bold text-slate-500">({wishlistItems.length} items)</span>
            </h1>
          </div>

          <button
            type="button"
            onClick={clearWishlist}
            className="self-start sm:self-center inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-500 border border-rose-200 hover:border-rose-500 text-rose-600 hover:text-white text-xs font-extrabold uppercase tracking-wider transition-all duration-200 active:scale-95 shadow-xs cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Wishlist</span>
          </button>
        </div>

        {/* Grid Display */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlistItems.map((product) => {
            // Safe Image Resolution Algorithm
            const firstImg = product.images?.[0];
            let imgUrl = 'https://via.placeholder.com/300';

            if (typeof firstImg === 'string') {
              imgUrl = firstImg;
            } else if (firstImg && typeof firstImg === 'object' && firstImg.url) {
              imgUrl = firstImg.url; // Handles Cloudinary image objects ({ url: '...' })
            } else if (typeof product.image === 'string') {
              imgUrl = product.image; // Fallback for single image field
            }

            const isOutOfStock = product.stock < 1;

            return (
              <div
                key={product._id}
                className="group relative bg-white border border-slate-200/80 hover:border-cyan-500/50 rounded-3xl overflow-hidden flex flex-col shadow-xs hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300"
              >
                {/* Product Image */}
                <div className="relative h-52 bg-slate-100 overflow-hidden">
                  <img
                    src={imgUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  <button
                    type="button"
                    onClick={() => removeFromWishlist(product._id)}
                    className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-rose-500 text-slate-700 hover:text-white rounded-full backdrop-blur-md border border-slate-200 hover:border-rose-500 shadow-xs transition-all duration-200 active:scale-90 cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  {isOutOfStock && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-900/90 text-white text-[10px] font-black uppercase tracking-wider backdrop-blur-md">
                      Out of Stock
                    </span>
                  )}
                </div>

                {/* Info & Action */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <Link
                      to={`/products/${product._id}`}
                      className="font-extrabold text-sm text-slate-900 hover:text-cyan-600 transition-colors line-clamp-1"
                    >
                      {product.name}
                    </Link>
                    <p className="text-base font-black text-cyan-600 mt-1">
                      ${product.price?.toFixed(2)}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleMoveToCart(product)}
                    disabled={isOutOfStock}
                    className="group/btn relative w-full py-2.5 px-4 bg-slate-50 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-600 text-slate-900 hover:text-white border border-slate-200 hover:border-transparent rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-xs font-extrabold uppercase tracking-wider disabled:opacity-40 disabled:hover:bg-slate-50 disabled:hover:text-slate-900 disabled:cursor-not-allowed shadow-xs active:scale-95 overflow-hidden cursor-pointer"
                  >
                    <ShoppingCart className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform" />
                    <span>{isOutOfStock ? 'Out of Stock' : 'Move to Cart'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}