import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import orderService from '../services/orderService';
import { 
  ShoppingBag, 
  PackageCheck, 
  Calendar, 
  ArrowRight, 
  RefreshCw, 
  Clock, 
  AlertCircle,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService.getMyOrders()
      .then((res) => {
        if (res.success) setOrders(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // Skeleton Loading State
  if (loading) {
    return (
      <div className="bg-surface-50 min-h-[calc(100vh-80px)] py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="h-10 w-48 bg-surface-200/80 rounded-2xl animate-pulse mb-8" />
          {[1, 2, 3].map((n) => (
            <div 
              key={n} 
              className="bg-surface-100 border border-surface-200/80 rounded-[2rem] p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-6 w-24 bg-surface-200 rounded-full animate-pulse" />
                  <div className="h-6 w-20 bg-surface-200 rounded-full animate-pulse" />
                </div>
                <div className="h-4 w-44 bg-surface-200 rounded-lg animate-pulse" />
              </div>
              <div className="flex items-center justify-between md:justify-end gap-6">
                <div className="h-8 w-24 bg-surface-200 rounded-xl animate-pulse" />
                <div className="h-11 w-32 bg-surface-200 rounded-2xl animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-50 min-h-[calc(100vh-80px)] text-surface-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-surface-200/80">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 bg-brand-500/10 text-brand-500 rounded-2xl border border-brand-500/20">
                <PackageCheck className="w-6 h-6" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-surface-900 tracking-tight">
                My Order History
              </h1>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-surface-500 pl-11">
              Track, manage, and review your previous purchases
            </p>
          </div>

          {orders.length > 0 && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-surface-100 border border-surface-200/80 text-xs font-black text-surface-700 shadow-sm self-start sm:self-auto">
              <ShoppingBag className="w-4 h-4 text-brand-500" />
              <span>{orders.length} {orders.length === 1 ? 'Order' : 'Total Orders'}</span>
            </div>
          )}
        </div>

        {/* Empty State */}
        {orders.length === 0 ? (
          <div className="bg-surface-100 border border-surface-200/90 rounded-[2.5rem] p-10 sm:p-16 text-center shadow-xl shadow-surface-900/5 max-w-2xl mx-auto relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-500 to-tealAccent-500" />
            <div className="w-20 h-20 bg-brand-500/10 border border-brand-500/20 text-brand-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black text-surface-900 tracking-tight mb-2">
              No Orders Placed Yet
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-surface-500 max-w-md mx-auto leading-relaxed mb-8">
              Looks like your order history is empty. Discover our latest collection and start your shopping journey today!
            </p>
            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-brand-500/25 transition-all duration-300 active:scale-95 group"
            >
              <span>Start Shopping</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        ) : (
          /* Order Cards List */
          <div className="space-y-4">
            {orders.map((order) => {
              const isCancelled = order.orderStatus === 'cancelled';
              const isDelivered = order.orderStatus === 'delivered';

              return (
                <div
                  key={order._id}
                  className="group bg-surface-100 border border-surface-200/90 hover:border-brand-500/30 rounded-[2rem] p-6 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-surface-900/5 flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  {/* Left Column: Order Meta */}
                  <div className="space-y-3 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-mono font-black text-sm sm:text-base text-surface-900 tracking-tight group-hover:text-brand-500 transition-colors">
                        #{order.orderNumber}
                      </span>
                      
                      {/* Status Tag */}
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider border ${
                          isCancelled
                            ? 'bg-red-500/10 text-red-600 border-red-500/20'
                            : isDelivered
                            ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                            : 'bg-brand-500/10 text-brand-500 border-brand-500/20'
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-semibold text-surface-500 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-surface-400" />
                        <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                      </div>
                      <span className="text-surface-300">•</span>
                      <div className="flex items-center gap-1.5">
                        <PackageCheck className="w-3.5 h-3.5 text-surface-400" />
                        <span>{order.items?.length || 0} {order.items?.length === 1 ? 'item' : 'items'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Price & Action */}
                  <div className="flex items-center justify-between md:justify-end gap-6 pt-4 md:pt-0 border-t md:border-t-0 border-surface-200/60">
                    <div className="text-left md:text-right">
                      <p className="text-[10px] font-extrabold text-surface-400 uppercase tracking-wider">
                        Total Amount
                      </p>
                      <span className="text-xl sm:text-2xl font-black text-surface-900 tracking-tight">
                        ৳{order.total?.toLocaleString()}
                      </span>
                    </div>

                    <Link
                      to={`/orders/${order._id}`}
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-surface-900 hover:bg-brand-500 text-surface-50 hover:text-white text-xs font-extrabold transition-all duration-300 shadow-md active:scale-95 group/btn"
                    >
                      <span>View Details</span>
                      <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}