import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import adminService from '../../services/adminService';

export default function AdminOrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('');

  const fetchOrderDetail = async () => {
    try {
      setLoading(true);
      const res = await adminService.getAdminOrderById(id);
      setOrder(res.data);
      setSelectedStatus(res.data.orderStatus);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load order');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetail();
  }, [id]);

  const handleStatusUpdate = async () => {
    if (!selectedStatus) return;
    try {
      setUpdating(true);
      await adminService.updateOrderStatus(id, selectedStatus);
      fetchOrderDetail();
    } catch (err) {
      alert(err.response?.data?.message || 'Status update failed');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-400 font-mono text-xs">Loading order details...</div>;
  if (error || !order) return (
    <div className="p-3 bg-rose-950/40 border border-rose-500/40 rounded-lg text-rose-300 font-mono text-xs flex items-center space-x-2">
      <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
      <span>[ERROR]: {error || 'Order not found'}</span>
    </div>
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-mono">
      {/* Top Header & Status Pipeline Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-cyan-500/20 pb-4">
        <div>
          <Link to="/admin/orders" className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
            &lt;-- Back to Orders
          </Link>
          <h1 className="text-xl font-black uppercase tracking-wider bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-white bg-clip-text text-transparent mt-1">
            Order #{order.orderNumber || order._id.slice(-6)}
          </h1>
        </div>

        {/* Status Pipeline Quick Actions */}
        <div className="flex items-center space-x-3 bg-[#080813] border border-cyan-500/20 p-2.5 rounded-xl shadow-[0_0_15px_rgba(34,211,238,0.05)]">
          <label className="text-[11px] font-bold uppercase text-slate-400">Fulfillment Status:</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-[#030308] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
          >
            <option value="pending" className="bg-[#030308] text-slate-200">Pending</option>
            <option value="processing" className="bg-[#030308] text-slate-200">Processing</option>
            <option value="shipped" className="bg-[#030308] text-slate-200">Shipped</option>
            <option value="delivered" className="bg-[#030308] text-slate-200">Delivered</option>
            <option value="cancelled" className="bg-[#030308] text-slate-200">Cancelled</option>
          </select>
          <button
            onClick={handleStatusUpdate}
            disabled={updating || selectedStatus === order.orderStatus}
            className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs disabled:opacity-40 transition-all shadow-[0_0_10px_rgba(34,211,238,0.3)]"
          >
            {updating ? 'Updating...' : 'Update Status'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Purchased Items */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#080813] border border-cyan-500/20 rounded-xl p-6 shadow-[0_0_15px_rgba(34,211,238,0.05)]">
            <h2 className="text-sm font-bold uppercase tracking-wider text-cyan-300 border-b border-slate-800/80 pb-3 mb-4">
              Ordered Items
            </h2>
            <div className="divide-y divide-slate-800/60">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-semibold text-slate-100">{item.product?.name || item.name || 'Product'}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Qty: {item.quantity} x ৳{item.price}</p>
                  </div>
                  <p className="font-bold text-cyan-300">৳{item.quantity * item.price}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/80 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span>৳{order.subtotal || order.total}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Shipping Fee</span>
                <span>৳{order.shippingFee || 0}</span>
              </div>
              <div className="flex justify-between font-bold text-slate-100 text-sm pt-3 border-t border-slate-800/80">
                <span>Total Amount</span>
                <span className="text-fuchsia-400 text-base">৳{order.total}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping & Payment Meta */}
        <div className="space-y-6">
          <div className="bg-[#080813] border border-cyan-500/20 rounded-xl p-6 space-y-4 shadow-[0_0_15px_rgba(34,211,238,0.05)]">
            <h2 className="text-sm font-bold uppercase tracking-wider text-cyan-300 border-b border-slate-800/80 pb-3">
              Customer Details
            </h2>
            <div className="text-xs text-slate-300 space-y-1">
              <p className="font-semibold text-slate-100">{order.shippingAddress?.name || order.user?.name}</p>
              <p className="text-slate-400">{order.user?.email}</p>
              <p className="text-slate-400">{order.shippingAddress?.phone}</p>
            </div>
            <div className="pt-3 border-t border-slate-800/80 text-xs">
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Shipping Address</span>
              <p className="text-slate-300 leading-relaxed">
                {order.shippingAddress?.address}, {order.shippingAddress?.city}
              </p>
            </div>
          </div>

          <div className="bg-[#080813] border border-cyan-500/20 rounded-xl p-6 space-y-3 shadow-[0_0_15px_rgba(34,211,238,0.05)]">
            <h2 className="text-sm font-bold uppercase tracking-wider text-cyan-300 border-b border-slate-800/80 pb-3">
              Payment Information
            </h2>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Payment Method:</span>
              <span className="font-semibold text-slate-200 capitalize">{order.paymentMethod || 'COD'}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Payment Status:</span>
              <span className={`font-bold ${order.isPaid ? 'text-emerald-400' : 'text-amber-400'}`}>
                {order.isPaid ? 'Paid' : 'Pending'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}