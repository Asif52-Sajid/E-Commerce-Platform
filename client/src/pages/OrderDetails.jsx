import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import orderService from '../services/orderService';
import { reviewService } from '../services/reviewService';
import OrderStatusTracker from '../components/orders/OrderStatusTracker';
import { 
  MapPin, 
  CreditCard, 
  Package, 
  Calendar, 
  AlertTriangle, 
  XCircle, 
  ArrowLeft,
  ShieldCheck,
  RefreshCw,
  ShoppingBag,
  Receipt,
  Clock,
  Star,
  CheckCircle2,
  Sparkles,
  Send,
  MessageCircle,
  Link as LinkIcon,
  Info
} from 'lucide-react';

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState(null);
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);

  // Review states per item: { [productId]: { rating: 5, comment: '', image: '', submitting: false, submitted: false, errorMsg: null } }
  const [reviewForms, setReviewForms] = useState({});

  useEffect(() => {
    orderService.getOrderById(id)
      .then((res) => {
        if (res && res.success) {
          setOrder(res.data);
        } else {
          setError('Failed to load order details.');
        }
      })
      .catch((err) => {
        console.error(err);
        setError(err.message || 'Failed to load order details.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleCancel = async () => {
    try {
      setCancelling(true);
      const res = await orderService.cancelOrder(id);
      if (res && res.success) {
        setOrder(res.data);
        setShowConfirmCancel(false);
      }
    } catch (err) {
      alert(err.message || 'Failed to cancel order.');
    } finally {
      setCancelling(false);
    }
  };

  const handleReviewChange = (productId, field, value) => {
    setReviewForms((prev) => ({
      ...prev,
      [productId]: {
        rating: 5,
        comment: '',
        image: '',
        errorMsg: null,
        ...(prev[productId] || {}),
        [field]: value,
      },
    }));
  };

  const handleReviewSubmit = async (productId, e) => {
    e.preventDefault();
    const formData = reviewForms[productId];
    if (!formData || !formData.comment?.trim()) {
      setReviewForms((prev) => ({
        ...prev,
        [productId]: { ...prev[productId], errorMsg: 'Please enter a review comment.' },
      }));
      return;
    }

    try {
      setReviewForms((prev) => ({
        ...prev,
        [productId]: { ...prev[productId], submitting: true, errorMsg: null },
      }));

      await reviewService.createReview(productId, {
        rating: Number(formData.rating || 5),
        comment: formData.comment,
        image: formData.image || undefined,
      });

      setReviewForms((prev) => ({
        ...prev,
        [productId]: { ...prev[productId], submitting: false, submitted: true },
      }));
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Failed to submit review.';
      setReviewForms((prev) => ({
        ...prev,
        [productId]: { ...prev[productId], submitting: false, errorMsg: errMsg },
      }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-surface-50 flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-5 text-center">
          <div className="relative flex items-center justify-center">
            <div className="w-20 h-20 rounded-3xl bg-brand-500/10 border border-brand-500/20 animate-pulse" />
            <div className="absolute w-14 h-14 bg-surface-100 border border-brand-500/40 rounded-2xl flex items-center justify-center text-brand-500 shadow-2xl">
              <RefreshCw className="w-6 h-6 animate-spin" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-black text-surface-900 uppercase tracking-widest">
              Fetching Order Details
            </p>
            <p className="text-[11px] font-semibold text-surface-500">
              Securing your order data...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-surface-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center bg-surface-100 border border-surface-200/80 rounded-[2.5rem] p-8 sm:p-10 shadow-2xl shadow-surface-900/5 animate-in fade-in zoom-in-95 duration-300 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-500 to-amber-500" />
          <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
            <AlertTriangle className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-surface-900 tracking-tight mb-2">
            {error || 'Order Not Found'}
          </h2>
          <p className="text-xs font-semibold text-surface-500 leading-relaxed mb-8">
            We couldn't locate this order in your account history.
          </p>
          <Link
            to="/my-orders"
            className="inline-flex items-center justify-center gap-2 w-full py-4 px-6 rounded-2xl bg-surface-900 text-surface-50 hover:bg-brand-500 hover:text-white font-extrabold text-xs uppercase tracking-wider shadow-lg transition-all duration-300 active:scale-95"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Go to My Orders</span>
          </Link>
        </div>
      </div>
    );
  }

  const canCancel = ['pending', 'confirmed'].includes(order.orderStatus);
  const orderStatusStr = (order.orderStatus || '').toLowerCase();
  const isDelivered = orderStatusStr === 'delivered';

  const getProductImage = (item) => {
    if (!item) return '';
    if (typeof item.image === 'string' && item.image.trim() !== '') return item.image;
    if (item.image?.url) return item.image.url;

    const prod = item.product;
    if (prod) {
      if (typeof prod.image === 'string' && prod.image.trim() !== '') return prod.image;
      if (prod.primaryImage?.url) return prod.primaryImage.url;
      
      if (Array.isArray(prod.images) && prod.images.length > 0) {
        const firstImg = prod.images[0];
        if (typeof firstImg === 'string') return firstImg;
        if (firstImg?.url) return firstImg.url;
      }
    }

    return '';
  };

  return (
    <div className="bg-surface-50 min-h-[calc(100vh-80px)] text-surface-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
        
        {/* Navigation Bar */}
        <div className="flex items-center justify-between">
          <Link 
            to="/my-orders" 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-surface-100 border border-surface-200/80 text-xs font-black text-surface-700 hover:text-brand-500 hover:border-brand-500/30 transition-all shadow-sm group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to My Orders</span>
          </Link>
          <div className="flex items-center gap-2 text-xs font-bold text-surface-500">
            <Clock className="w-3.5 h-3.5" />
            <span>{new Date(order.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Hero Section Card */}
        <div className="relative overflow-hidden bg-gradient-to-br from-surface-900 via-surface-900 to-surface-800 rounded-[2.5rem] p-6 sm:p-10 text-white shadow-2xl">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 rounded-full bg-brand-500/20 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 -mb-12 w-48 h-48 rounded-full bg-tealAccent-500/10 blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-brand-500/20 border border-brand-500/30 text-brand-400 backdrop-blur-md">
                  {order.orderStatus}
                </span>
                <span className="text-xs font-bold text-surface-400">
                  ID: #{order._id}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                Order #{order.orderNumber}
              </h1>
              <div className="flex items-center gap-2 text-xs font-semibold text-surface-300">
                <Calendar className="w-4 h-4 text-brand-400" />
                <span>Placed on {new Date(order.createdAt).toLocaleString()}</span>
              </div>
            </div>

            {canCancel && (
              <div className="flex items-center md:self-center">
                {!showConfirmCancel ? (
                  <button
                    type="button"
                    onClick={() => setShowConfirmCancel(true)}
                    className="group relative inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-red-500/20 border border-white/15 hover:border-red-500/40 text-white font-extrabold text-xs uppercase tracking-wider backdrop-blur-md transition-all duration-300 active:scale-95 overflow-hidden shadow-lg"
                  >
                    <XCircle className="w-4 h-4 text-red-400 group-hover:rotate-90 transition-transform duration-300" />
                    <span>Cancel Order</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2 bg-red-950/80 border border-red-500/40 p-2 rounded-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200">
                    <span className="text-[11px] font-extrabold text-red-300 px-3">
                      Are you sure?
                    </span>
                    <button
                      type="button"
                      onClick={handleCancel}
                      disabled={cancelling}
                      className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-black shadow-md transition-all active:scale-95 disabled:opacity-50 flex items-center gap-1.5"
                    >
                      {cancelling ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        'Yes, Cancel'
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowConfirmCancel(false)}
                      className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-extrabold transition-all"
                    >
                      No
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-surface-300 text-xs font-bold">
              <Receipt className="w-4 h-4 text-brand-400" />
              <span>Total Items: <strong className="text-white font-black">{order.items?.length || 0}</strong></span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xs font-extrabold text-surface-400 uppercase tracking-wider">Total</span>
              <span className="text-2xl font-black text-brand-400">
                ৳{order.total?.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Visual Progress Status Tracker Container */}
        <div className="bg-surface-100 border border-surface-200/90 rounded-[2rem] p-6 sm:p-8 shadow-sm">
          <OrderStatusTracker currentStatus={order.orderStatus} />
        </div>

        {/* Grid Section for Shipping & Payment Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="group bg-surface-100 border border-surface-200/90 rounded-[2rem] p-7 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-surface-200/60">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-brand-500/10 rounded-2xl text-brand-500 border border-brand-500/20 group-hover:scale-110 transition-transform">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-black text-surface-900 tracking-tight">
                      Shipping Address
                    </h2>
                    <p className="text-[11px] font-bold text-surface-500">Destination info</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-xs font-medium text-surface-700">
                <div className="p-3.5 rounded-xl bg-surface-50 border border-surface-200/60">
                  <p className="text-xs font-black text-surface-900 mb-0.5">
                    {order.shippingAddress?.fullName}
                  </p>
                  <p className="font-bold text-surface-600">
                    {order.shippingAddress?.phone}
                  </p>
                </div>
                <div className="px-1 space-y-1">
                  <p className="font-semibold text-surface-700 leading-relaxed">
                    {order.shippingAddress?.addressLine}, {order.shippingAddress?.city}
                  </p>
                  <p className="font-bold text-surface-900">
                    {order.shippingAddress?.postalCode}, {order.shippingAddress?.country}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="group bg-surface-100 border border-surface-200/90 rounded-[2rem] p-7 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-surface-200/60">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-tealAccent-500/10 rounded-2xl text-tealAccent-500 border border-tealAccent-500/20 group-hover:scale-110 transition-transform">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-black text-surface-900 tracking-tight">
                      Payment Info
                    </h2>
                    <p className="text-[11px] font-bold text-surface-500">Billing transaction</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3.5 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-surface-50 border border-surface-200/60">
                  <span className="font-extrabold text-surface-600 uppercase tracking-wider text-[10px]">Payment Method</span>
                  <span className="font-black text-brand-500 uppercase px-3 py-1 rounded-lg bg-brand-500/10 border border-brand-500/20 text-xs">
                    {order.paymentMethod}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-xl bg-surface-50 border border-surface-200/60">
                  <span className="font-extrabold text-surface-600 uppercase tracking-wider text-[10px]">Payment Status</span>
                  <span className="font-black text-surface-900 capitalize px-3 py-1 rounded-lg bg-surface-100 border border-surface-200 text-xs">
                    {order.paymentStatus}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-6 flex items-center gap-2 text-[11px] font-extrabold text-emerald-600 border-t border-surface-200/60">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Encrypted & Verified Payment</span>
            </div>
          </div>
        </div>

        {/* Ordered Items Layout with Delivery-Gated Review Form */}
        <div className="bg-surface-100 border border-surface-200/90 rounded-[2.5rem] p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between pb-6 mb-6 border-b border-surface-200/60">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-brand-500/10 rounded-2xl text-brand-500 border border-brand-500/20">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-black text-surface-900 tracking-tight">
                  Package Content
                </h2>
                <p className="text-xs font-bold text-surface-500">Items included in this delivery</p>
              </div>
            </div>
            <span className="text-xs font-black text-brand-500 px-3.5 py-1.5 bg-brand-500/10 border border-brand-500/20 rounded-xl">
              {order.items?.length || 0} Total
            </span>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {order.items.map((item, idx) => {
              const productImage = getProductImage(item);
              const product = item.product || {};
              const productId = product._id || product.id || item.product;
              const formState = reviewForms[productId] || { rating: 5, comment: '', image: '', submitting: false, submitted: false, errorMsg: null };

              return (
                <div 
                  key={idx} 
                  className="p-4 sm:p-6 rounded-2xl bg-surface-50 border border-surface-200/70 hover:border-brand-500/30 transition-all duration-300 space-y-4 shadow-sm"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="relative overflow-hidden rounded-2xl bg-surface-100 border border-surface-200 flex-shrink-0">
                        {productImage ? (
                          <img 
                            src={productImage} 
                            alt={item.name || item.product?.name || 'Product Image'} 
                            className="w-16 h-16 sm:w-20 sm:h-20 object-cover" 
                          />
                        ) : (
                          <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center bg-surface-200 text-surface-400">
                            <Package className="w-6 h-6" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 space-y-1">
                        <p className="text-xs sm:text-sm font-black text-surface-900 line-clamp-1">
                          {item.name || item.product?.name}
                        </p>
                        <div className="flex items-center gap-2 text-xs font-bold text-surface-500">
                          <span>৳{item.price?.toLocaleString()}</span>
                          <span>×</span>
                          <span className="px-2 py-0.5 rounded-md bg-brand-500/10 text-brand-500 font-black">
                            {item.quantity}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <p className="text-[10px] font-extrabold text-surface-400 uppercase tracking-wider">Subtotal</p>
                      <p className="text-sm sm:text-base font-black text-surface-900">
                        ৳{item.subtotal?.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* REVIEW FORM: Appears ONLY when the order status is DELIVERED */}
                  {isDelivered && (
                    <div className="mt-4 pt-5 border-t border-surface-200/80 bg-gradient-to-br from-surface-100 via-surface-100/80 to-brand-500/[0.03] p-5 sm:p-6 rounded-[2rem] space-y-5 shadow-inner border border-brand-500/10">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-500">
                            <Star className="w-4 h-4 fill-brand-500 text-brand-500" />
                          </div>
                          <div>
                            <h4 className="text-xs font-black uppercase tracking-wider text-surface-900">Share Your Experience</h4>
                            <p className="text-[10px] font-bold text-surface-500">Help others make better choices</p>
                          </div>
                        </div>
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-[10px] font-black text-brand-600 uppercase tracking-widest">
                          <Sparkles className="w-3 h-3 animate-pulse" /> Verified Drop
                        </span>
                      </div>

                      {formState.submitted ? (
                        <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500/15 via-teal-500/10 to-brand-500/10 border border-emerald-500/30 rounded-2xl p-6 text-center space-y-3.5 animate-in fade-in zoom-in-95 duration-500 shadow-xl">
                          <div className="absolute -right-8 -bottom-8 w-28 h-28 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />
                          <div className="absolute -left-8 -top-8 w-28 h-28 bg-teal-500/15 rounded-full blur-2xl pointer-events-none" />
                          
                          <div className="w-14 h-14 bg-gradient-to-tr from-emerald-600 to-teal-500 text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30 animate-bounce duration-1000">
                            <CheckCircle2 className="w-7 h-7" />
                          </div>

                          <div className="space-y-1.5 relative z-10">
                            <h4 className="text-sm font-black text-surface-900 uppercase tracking-wider">
                              Review Dropped Successfully!
                            </h4>
                            <p className="text-xs font-semibold text-surface-600 max-w-md mx-auto leading-relaxed">
                              Your review has been successfully submitted and is currently pending admin validation. It will light up on the product page soon!
                            </p>
                          </div>

                          <div className="pt-1">
                            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-[11px] font-black text-emerald-800 shadow-sm">
                              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Pending Admin Approval
                            </span>
                          </div>
                        </div>
                      ) : (
                        <form onSubmit={(e) => handleReviewSubmit(productId, e)} className="space-y-4">
                          {/* Stylish Unique In-UI Error Banner (Replaces standard window alert) */}
                          {formState.errorMsg && (
                            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-red-500/10 border border-red-500/25 text-red-600 text-xs font-bold animate-in fade-in slide-in-from-top-2 duration-300 shadow-sm">
                              <Info className="w-4 h-4 flex-shrink-0 text-red-500 animate-pulse" />
                              <span className="flex-1 leading-snug">{formState.errorMsg}</span>
                              <button 
                                type="button" 
                                onClick={() => handleReviewChange(productId, 'errorMsg', null)}
                                className="text-red-400 hover:text-red-700 font-black p-1"
                              >
                                &times;
                              </button>
                            </div>
                          )}

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-surface-700 flex items-center gap-1.5">
                                <Star className="w-3.5 h-3.5 text-brand-500 fill-brand-500" /> Select Rating
                              </label>
                              <div className="relative">
                                <select
                                  value={formState.rating}
                                  onChange={(e) => handleReviewChange(productId, 'rating', Number(e.target.value))}
                                  className="w-full bg-white border border-surface-200/90 rounded-2xl px-4 py-3 text-xs font-black text-surface-900 focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 shadow-sm transition-all"
                                >
                                  <option value={5}>⭐⭐⭐⭐⭐ (5/5) Exceptional</option>
                                  <option value={4}>⭐⭐⭐⭐ (4/5) Very Good</option>
                                  <option value={3}>⭐⭐⭐ (3/5) Average</option>
                                  <option value={2}>⭐⭐ (2/5) Below Expectations</option>
                                  <option value={1}>⭐ (1/5) Poor</option>
                                </select>
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-surface-700 flex items-center gap-1.5">
                                <LinkIcon className="w-3.5 h-3.5 text-surface-500" /> Review Image URL <span className="text-[10px] text-surface-400 font-normal lowercase">(optional)</span>
                              </label>
                              <input
                                type="url"
                                value={formState.image}
                                onChange={(e) => handleReviewChange(productId, 'image', e.target.value)}
                                placeholder="https://example.com/photo.jpg"
                                className="w-full bg-white border border-surface-200/90 rounded-2xl px-4 py-3 text-xs text-surface-900 focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 shadow-sm transition-all"
                              />
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-surface-700 flex items-center gap-1.5">
                              <MessageCircle className="w-3.5 h-3.5 text-surface-500" /> Your Review Feedback
                            </label>
                            <textarea
                              rows={3}
                              value={formState.comment}
                              onChange={(e) => handleReviewChange(productId, 'comment', e.target.value)}
                              placeholder="Tell us what you loved about this product, quality, and overall experience..."
                              maxLength={500}
                              className="w-full bg-white border border-surface-200/90 rounded-2xl p-4 text-xs text-surface-900 focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 shadow-sm transition-all resize-none"
                              required
                            />
                            <div className="flex justify-end">
                              <span className="text-[10px] font-bold text-surface-400">
                                {formState.comment?.length || 0}/500 chars
                              </span>
                            </div>
                          </div>

                          <button
                            type="submit"
                            disabled={formState.submitting}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white font-black text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer disabled:opacity-50 shadow-xl shadow-brand-500/25 active:scale-95 group"
                          >
                            {formState.submitting ? (
                              <>
                                <RefreshCw className="w-4 h-4 animate-spin" />
                                <span>Submitting Review...</span>
                              </>
                            ) : (
                              <>
                                <span>Submit Review</span>
                                <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                              </>
                            )}
                          </button>
                        </form>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-6 border-t border-surface-200/80">
            <div className="bg-gradient-to-r from-surface-900 to-surface-800 rounded-2xl p-6 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
              <div className="space-y-0.5">
                <p className="text-xs font-extrabold text-surface-400 uppercase tracking-widest">
                  Grand Total
                </p>
                <p className="text-xs text-surface-300 font-semibold">
                  Inclusive of all taxes & charges
                </p>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-3xl font-black text-brand-400 tracking-tight">
                  ৳{order.total?.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}