import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, ShoppingBag, ArrowRight, Sparkles, Minus, Plus, ShieldCheck } from 'lucide-react';

const getOptimizedImageUrl = (url, options = {}) => {
  if (!url || typeof url !== 'string') {
    return 'https://via.placeholder.com/150';
  }

  // If it's a Cloudinary URL, inject scaling parameters
  if (url.includes('res.cloudinary.com') && url.includes('/upload/')) {
    const { width = 150, quality = 'auto', format = 'auto' } = options;
    const transformString = `w_${width},c_scale,f_${format},q_${quality}`;
    return url.replace('/upload/', `/upload/${transformString}/`);
  }

  return url;
};

export default function Cart() {
  const { cartItems, totalPrice, updateQuantity, removeFromCart, clearCart, loading } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-surface-50 flex flex-col items-center justify-center p-6 text-surface-800">
        <div className="relative flex items-center justify-center mb-4">
          <div className="w-12 h-12 rounded-full border-4 border-brand-500/20 border-t-brand-500 animate-spin" />
          <ShoppingBag className="w-5 h-5 text-brand-500 absolute" />
        </div>
        <p className="text-xs font-black uppercase tracking-widest text-surface-800 animate-pulse">
          Loading Your Cart...
        </p>
      </div>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-surface-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center bg-surface-100 border border-surface-200/80 rounded-3xl p-8 sm:p-10 shadow-xl shadow-surface-900/5 animate-in fade-in zoom-in-95 duration-300">
          <div className="relative w-24 h-24 bg-gradient-to-br from-brand-500/10 via-tealAccent-500/10 to-brand-500/20 border border-brand-500/30 rounded-3xl flex items-center justify-center mx-auto mb-6 text-brand-500 shadow-inner group">
            <ShoppingBag className="w-10 h-10 group-hover:scale-110 transition-transform duration-300" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tealAccent-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-tealAccent-500 border-2 border-surface-100" />
            </span>
          </div>

          <h2 className="text-2xl font-black text-surface-900 tracking-tight mb-2">
            Your Cart is Empty
          </h2>
          <p className="text-xs font-semibold text-surface-800 leading-relaxed mb-8">
            Looks like you haven't added any items to your shopping cart yet. Discover our collection today!
          </p>

          <Link
            to="/products"
            className="group relative inline-flex items-center justify-center gap-2.5 w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-brand-500 to-tealAccent-500 hover:from-brand-600 hover:to-tealAccent-600 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-brand-500/25 transition-all duration-300 active:scale-95 overflow-hidden"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
            <span>Explore Products</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-50 min-h-[calc(100vh-80px)] text-surface-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-surface-200/80">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-brand-50 border border-brand-100 text-brand-500 text-[10px] font-black uppercase tracking-widest mb-1">
              <Sparkles className="w-3 h-3 text-brand-500" />
              <span>Checkout Ready</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-surface-900 tracking-tight">
              Shopping Cart <span className="text-sm font-bold text-surface-800">({cartItems.length} items)</span>
            </h1>
          </div>

          <button
            type="button"
            onClick={clearCart}
            className="self-start sm:self-center inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-500 border border-red-200 hover:border-red-500 text-red-600 hover:text-white text-xs font-extrabold uppercase tracking-wider transition-all duration-200 active:scale-95 shadow-sm"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Cart</span>
          </button>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Item List */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => {
              const product = item.product || {};
              const rawImage = product.images?.[0]?.url || product.images?.[0] || product.image;
              const thumbnailUrl = getOptimizedImageUrl(rawImage, { width: 150 });
              const maxStock = product.stock || 99;
              const productId = product._id || product.id;

              return (
                <div
                  key={item._id || productId}
                  className="group relative bg-surface-100 border border-surface-200/90 hover:border-brand-500/40 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="relative w-20 h-20 rounded-xl bg-surface-50 border border-surface-200 overflow-hidden flex-shrink-0">
                      <img
                        src={thumbnailUrl}
                        alt={product.name || 'Product Image'}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    <div className="min-w-0 flex-1 sm:flex-none">
                      <Link
                        to={`/products/${productId}`}
                        className="font-extrabold text-sm sm:text-base text-surface-900 hover:text-brand-500 transition-colors line-clamp-1"
                      >
                        {product.name}
                      </Link>
                      <p className="text-xs font-bold text-tealAccent-500 mt-1">
                        ${Number(product.price || 0).toFixed(2)}{' '}
                        <span className="text-[10px] font-semibold text-surface-800">/ unit</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 sm:gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-surface-200/60">
                    {/* Quantity Controls */}
                    <div className="flex items-center bg-surface-50 border border-surface-200 rounded-xl p-1 shadow-inner">
                      <button
                        type="button"
                        onClick={() => updateQuantity(productId, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-surface-800 hover:text-surface-900 hover:bg-surface-200/70 disabled:opacity-40 transition-colors active:scale-95"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>

                      <span className="w-8 text-center text-xs font-black text-surface-900">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() => updateQuantity(productId, item.quantity + 1)}
                        disabled={item.quantity >= maxStock}
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-surface-800 hover:text-surface-900 hover:bg-surface-200/70 disabled:opacity-40 transition-colors active:scale-95"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Subtotal & Remove */}
                    <div className="flex items-center gap-4">
                      <span className="font-black text-surface-900 text-base sm:text-lg min-w-[70px] text-right">
                        ${(item.subtotal || (product.price || 0) * item.quantity).toFixed(2)}
                      </span>

                      <button
                        type="button"
                        onClick={() => removeFromCart(productId)}
                        className="p-2 rounded-xl text-surface-800 hover:text-red-500 hover:bg-red-50 border border-transparent hover:border-red-200 transition-all duration-200 active:scale-95"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="bg-surface-100 border border-surface-200 rounded-3xl p-6 shadow-xl shadow-surface-900/5 h-fit space-y-6">
            <h2 className="text-lg font-black text-surface-900 tracking-tight pb-3 border-b border-surface-200">
              Order Summary
            </h2>

            <div className="space-y-3.5 text-xs font-semibold">
              <div className="flex justify-between text-surface-800">
                <span>Items Subtotal</span>
                <span className="font-extrabold text-surface-900">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-surface-800">
                <span>Shipping Fee</span>
                <span className="text-tealAccent-500 font-bold">Calculated at checkout</span>
              </div>
            </div>

            <div className="border-t border-surface-200 pt-4 flex justify-between items-center">
              <div>
                <span className="text-xs font-black text-surface-900 uppercase tracking-wider block">
                  Total Amount
                </span>
                <span className="text-[10px] text-surface-800 font-semibold">Taxes included</span>
              </div>
              <span className="text-2xl font-black text-brand-500 tracking-tight">
                ${totalPrice.toFixed(2)}
              </span>
            </div>

            <button
              type="button"
              onClick={() => navigate('/checkout')}
              className="group relative w-full py-3.5 px-4 bg-gradient-to-r from-brand-500 to-tealAccent-500 hover:from-brand-600 hover:to-tealAccent-600 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-brand-500/20 transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 overflow-hidden"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="pt-2 flex items-center justify-center gap-2 text-[11px] font-bold text-surface-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Encrypted & Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}