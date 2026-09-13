import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import orderService from '../services/orderService';
import { 
  ShoppingBag, 
  MapPin, 
  CreditCard, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  AlertCircle,
  Truck
} from 'lucide-react';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, subtotal, shippingFee, total, clearCart } = useCart();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    addressLine: '',
    city: '',
    postalCode: '',
    country: 'Bangladesh',
  });

  const [paymentMethod] = useState('cod');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const safeSubtotal = Number(subtotal) || 0;
  const safeShippingFee = Number(shippingFee) || 0;
  const safeTotal = Number(total) || safeSubtotal + safeShippingFee;

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
            Your cart is empty
          </h2>
          <p className="text-xs font-semibold text-surface-800 leading-relaxed mb-8">
            Add items to your cart before proceeding to checkout.
          </p>

          <Link
            to="/products"
            className="group relative inline-flex items-center justify-center gap-2.5 w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-brand-500 to-tealAccent-500 hover:from-brand-600 hover:to-tealAccent-600 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-brand-500/25 transition-all duration-300 active:scale-95 overflow-hidden"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.fullName || !formData.phone || !formData.addressLine || !formData.city || !formData.postalCode) {
      setError('Please fill in all required shipping fields.');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        shippingAddress: formData,
        paymentMethod,
      };

      const response = await orderService.createOrder(payload);

      if (response.success && response.data) {
        if (typeof clearCart === 'function') {
          await clearCart();
        }
        navigate(`/order-success/${response.data._id}`, { state: { order: response.data } });
      }
    } catch (err) {
      console.error('Checkout error:', err);
      const errorMsg = err.response?.data?.message || 'Failed to place order. Please check item stock and try again.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface-50 min-h-[calc(100vh-80px)] text-surface-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 pb-4 border-b border-surface-200/80">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-brand-50 border border-brand-100 text-brand-500 text-[10px] font-black uppercase tracking-widest mb-1">
            <Sparkles className="w-3 h-3 text-brand-500" />
            <span>Final Step</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-surface-900 tracking-tight">
            Checkout
          </h1>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-600 rounded-2xl flex items-center gap-3 text-xs font-bold animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500" />
            <p className="flex-1">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-surface-100 border border-surface-200/90 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2.5 mb-6 pb-3 border-b border-surface-200/60">
                <div className="p-2 bg-brand-50 rounded-xl text-brand-500">
                  <MapPin className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-surface-900 tracking-tight">
                  1. Shipping Information
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-extrabold text-surface-900 uppercase tracking-wider mb-1.5">
                    Full Name <span className="text-brand-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    placeholder="Your Name"
                    className="w-full px-4 py-3 bg-surface-50 border border-surface-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 rounded-xl text-xs font-bold text-surface-900 placeholder-surface-800 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-surface-900 uppercase tracking-wider mb-1.5">
                    Phone Number <span className="text-brand-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="+8801700000000"
                    className="w-full px-4 py-3 bg-surface-50 border border-surface-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 rounded-xl text-xs font-bold text-surface-900 placeholder-surface-800 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-surface-900 uppercase tracking-wider mb-1.5">
                    City <span className="text-brand-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    placeholder="Dhaka"
                    className="w-full px-4 py-3 bg-surface-50 border border-surface-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 rounded-xl text-xs font-bold text-surface-900 placeholder-surface-800 outline-none transition-all"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-extrabold text-surface-900 uppercase tracking-wider mb-1.5">
                    Address Line <span className="text-brand-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="addressLine"
                    value={formData.addressLine}
                    onChange={handleChange}
                    required
                    placeholder="House 12, Road 4, Sector 3"
                    className="w-full px-4 py-3 bg-surface-50 border border-surface-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 rounded-xl text-xs font-bold text-surface-900 placeholder-surface-800 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-surface-900 uppercase tracking-wider mb-1.5">
                    Postal Code <span className="text-brand-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    required
                    placeholder="1230"
                    className="w-full px-4 py-3 bg-surface-50 border border-surface-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 rounded-xl text-xs font-bold text-surface-900 placeholder-surface-800 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-surface-800 uppercase tracking-wider mb-1.5">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    disabled
                    className="w-full px-4 py-3 bg-surface-200/50 border border-surface-200 rounded-xl text-xs font-bold text-surface-800 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            <div className="bg-surface-100 border border-surface-200/90 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2.5 mb-6 pb-3 border-b border-surface-200/60">
                <div className="p-2 bg-tealAccent-500/10 rounded-xl text-tealAccent-500">
                  <CreditCard className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-surface-900 tracking-tight">
                  2. Payment Method
                </h2>
              </div>

              <div className="relative flex items-start gap-4 p-4 border-2 border-brand-500/40 bg-brand-50/20 rounded-2xl cursor-pointer transition-all">
                <div className="flex items-center h-5 mt-0.5">
                  <input
                    type="radio"
                    id="cod"
                    name="paymentMethod"
                    value="cod"
                    checked={true}
                    readOnly
                    className="h-4 w-4 text-brand-500 focus:ring-brand-500 border-surface-300"
                  />
                </div>
                <label htmlFor="cod" className="flex-1 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-surface-900">
                      Cash on Delivery (COD)
                    </span>
                    <span className="p-1 rounded-lg bg-tealAccent-500/10 text-tealAccent-500">
                      <Truck className="w-4 h-4" />
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-surface-800 mt-1 block leading-relaxed">
                    Pay with cash when your package arrives at your doorstep.
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-surface-100 border border-surface-200 rounded-3xl p-6 shadow-xl shadow-surface-900/5 sticky top-6 space-y-6">
              <h2 className="text-lg font-black text-surface-900 tracking-tight pb-3 border-b border-surface-200">
                Order Summary
              </h2>

              <div className="divide-y divide-surface-200/60 max-h-80 overflow-y-auto pr-1">
                {cartItems.map((item) => {
                  const prod = item.product || {};
                  const name = prod.name || item.name || 'Product';
                  
                  // Extract image URL properly from the image sub-document schema array
                  const imageObj = prod.images?.[0];
                  const image = (imageObj && typeof imageObj === 'object' ? imageObj.url : imageObj) || 
                                prod.image || 
                                item.image || 
                                'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=200&q=80';

                  const price = prod.price || item.price || 0;

                  return (
                    <div key={item._id || prod._id} className="py-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={image}
                          alt={name}
                          className="w-12 h-12 object-cover rounded-xl bg-surface-50 border border-surface-200 flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-extrabold text-surface-900 line-clamp-1">
                            {name}
                          </p>
                          <p className="text-[11px] font-bold text-surface-800">
                            Qty: <span className="text-brand-500">{item.quantity}</span>
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-black text-surface-900 flex-shrink-0">
                        ৳{(price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-surface-200 pt-4 space-y-3">
                <div className="flex justify-between text-xs font-semibold text-surface-800">
                  <span>Subtotal</span>
                  <span className="font-extrabold text-surface-900">৳{safeSubtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs font-semibold text-surface-800">
                  <span>Shipping Fee</span>
                  <span className="text-tealAccent-500 font-bold">
                    {safeShippingFee === 0 ? 'FREE' : `৳${safeShippingFee}`}
                  </span>
                </div>
                
                <div className="border-t border-surface-200 pt-4 flex justify-between items-center">
                  <div>
                    <span className="text-xs font-black text-surface-900 uppercase tracking-wider block">
                      Total Amount
                    </span>
                    <span className="text-[10px] text-surface-800 font-semibold">Taxes included</span>
                  </div>
                  <span className="text-2xl font-black text-brand-500 tracking-tight">
                    ৳{safeTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`group relative w-full py-3.5 px-4 rounded-2xl text-white font-extrabold text-xs uppercase tracking-wider shadow-lg transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 overflow-hidden ${
                  loading
                    ? 'bg-surface-300 cursor-not-allowed shadow-none'
                    : 'bg-gradient-to-r from-brand-500 to-tealAccent-500 hover:from-brand-600 hover:to-tealAccent-600 shadow-brand-500/20'
                }`}
              >
                {!loading && (
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                )}
                <span>{loading ? 'Processing Order...' : 'Place Order'}</span>
                {!loading && (
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                )}
              </button>

              <div className="pt-2 flex items-center justify-center gap-2 text-[11px] font-bold text-surface-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Encrypted & Secure Checkout</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;