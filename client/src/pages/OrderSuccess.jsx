import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import orderService from '../services/orderService';
import { 
  CheckCircle2, 
  ShoppingBag, 
  Truck, 
  ArrowRight, 
  Receipt, 
  Sparkles, 
  AlertCircle,
  PackageCheck
} from 'lucide-react';

export default function OrderSuccess() {
  const { id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);

  useEffect(() => {
    if (!order && id) {
      orderService.getOrderById(id)
        .then((res) => {
          if (res.success) setOrder(res.data);
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [id, order]);

  // Loading state with pulse animation
  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-surface-50 flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <div className="absolute inset-0 rounded-2xl bg-brand-500/20 animate-ping" />
            <div className="relative w-14 h-14 bg-surface-100 border border-brand-500/30 rounded-2xl flex items-center justify-center text-brand-500 shadow-lg">
              <Receipt className="w-6 h-6 animate-bounce" />
            </div>
          </div>
          <p className="text-xs font-black text-surface-800 uppercase tracking-widest animate-pulse">
            Loading receipt...
          </p>
        </div>
      </div>
    );
  }

  // Not Found State
  if (!order) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-surface-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center bg-surface-100 border border-surface-200/80 rounded-3xl p-8 sm:p-10 shadow-xl shadow-surface-900/5 animate-in fade-in zoom-in-95 duration-300">
          <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10" />
          </div>

          <h2 className="text-2xl font-black text-surface-900 tracking-tight mb-2">
            Order Not Found
          </h2>
          <p className="text-xs font-semibold text-surface-800 leading-relaxed mb-8">
            We couldn't retrieve the details for this order. Please check your order history.
          </p>

          <Link
            to="/my-orders"
            className="group relative inline-flex items-center justify-center gap-2.5 w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-brand-500 to-tealAccent-500 hover:from-brand-600 hover:to-tealAccent-600 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-brand-500/25 transition-all duration-300 active:scale-95 overflow-hidden"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
            <span>View My Orders</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-50 min-h-[calc(100vh-80px)] text-surface-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Celebration Header Card */}
        <div className="relative bg-surface-100 border border-surface-200/90 rounded-3xl p-8 sm:p-10 text-center shadow-xl shadow-surface-900/5 overflow-hidden">
          {/* Subtle Ambient Background Glows */}
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-tealAccent-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Animated Success Icon Badge */}
          <div className="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-tealAccent-500 to-brand-500 opacity-20 animate-pulse" />
            <div className="relative w-full h-full bg-gradient-to-tr from-tealAccent-500/15 via-surface-100 to-brand-500/15 border border-tealAccent-500/40 rounded-3xl flex items-center justify-center text-tealAccent-500 shadow-inner group">
              <CheckCircle2 className="w-10 h-10 group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tealAccent-500/10 border border-tealAccent-500/20 text-tealAccent-500 text-[10px] font-black uppercase tracking-widest mb-3">
            <Sparkles className="w-3 h-3 text-tealAccent-500" />
            <span>Confirmed</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-surface-900 tracking-tight mb-3">
            Order Placed Successfully!
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-surface-800 max-w-md mx-auto leading-relaxed">
            Thank you for your purchase. Your order number is{' '}
            <span className="inline-block px-2.5 py-0.5 rounded-lg bg-surface-50 border border-surface-200 text-brand-500 font-mono font-black text-xs sm:text-sm ml-1">
              #{order.orderNumber}
            </span>
          </p>

          {/* Call to Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to={`/orders/${order._id}`}
              className="group relative inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-brand-500 to-tealAccent-500 hover:from-brand-600 hover:to-tealAccent-600 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-brand-500/20 transition-all duration-300 active:scale-95 overflow-hidden"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
              <Truck className="w-4 h-4" />
              <span>Track Order Status</span>
            </Link>

            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-surface-50 border border-surface-200 hover:border-surface-300 text-surface-900 font-extrabold text-xs uppercase tracking-wider shadow-sm transition-all duration-300 active:scale-95 hover:bg-surface-200/50"
            >
              <ShoppingBag className="w-4 h-4 text-surface-800" />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>

        {/* Receipt / Order Summary Card */}
        <div className="bg-surface-100 border border-surface-200/90 rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-surface-200/60">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-brand-500/10 rounded-xl text-brand-500">
                <PackageCheck className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-black text-surface-900 tracking-tight">
                Order Summary
              </h2>
            </div>
            <span className="text-[11px] font-black text-surface-800 uppercase tracking-widest px-2.5 py-1 rounded-lg bg-surface-50 border border-surface-200">
              {order.items?.length || 0} {order.items?.length === 1 ? 'Item' : 'Items'}
            </span>
          </div>

          {/* Items List */}
          <div className="divide-y divide-surface-200/60">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-2 h-2 rounded-full bg-tealAccent-500 flex-shrink-0" />
                  <span className="text-xs font-extrabold text-surface-900 line-clamp-1">
                    {item.name}
                    <span className="text-surface-800 font-bold ml-2">× {item.quantity}</span>
                  </span>
                </div>
                <span className="text-xs font-black text-surface-900 flex-shrink-0">
                  ৳{item.subtotal.toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          {/* Total Breakdown */}
          <div className="border-t border-surface-200/80 pt-5 mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-surface-900 uppercase tracking-wider">
                Total Paid (COD):
              </span>
              <span className="px-2 py-0.5 rounded-md bg-tealAccent-500/10 text-tealAccent-500 text-[10px] font-extrabold uppercase tracking-wider">
                Cash On Delivery
              </span>
            </div>
            <span className="text-2xl font-black text-brand-500 tracking-tight">
              ৳{order.total.toLocaleString()}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}