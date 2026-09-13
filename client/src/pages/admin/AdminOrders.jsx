import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import adminService from '../../services/adminService';

const STATUS_BADGES = {
  pending: 'bg-amber-950/60 text-amber-400 border-amber-800/60 shadow-[0_0_8px_rgba(251,191,36,0.15)]',
  processing: 'bg-cyan-950/60 text-cyan-400 border-cyan-800/60 shadow-[0_0_8px_rgba(34,211,238,0.15)]',
  shipped: 'bg-fuchsia-950/60 text-fuchsia-400 border-fuchsia-800/60 shadow-[0_0_8px_rgba(232,121,249,0.15)]',
  delivered: 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60 shadow-[0_0_8px_rgba(52,211,153,0.15)]',
  cancelled: 'bg-rose-950/60 text-rose-400 border-rose-800/60 shadow-[0_0_8px_rgba(251,113,133,0.15)]',
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [deletingOrderId, setDeletingOrderId] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await adminService.getAdminOrders({
        page,
        limit: 8,
        status,
        search: activeSearch,
      });
      setOrders(res.data);
      setPagination(res.pagination);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, status, activeSearch]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setActiveSearch(search.trim());
    setPage(1);
  };

  const handleClearSearch = () => {
    setSearch('');
    setActiveSearch('');
    setPage(1);
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      await adminService.deleteOrder(orderId);
      setDeletingOrderId(null);
      fetchOrders();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete order');
      setDeletingOrderId(null);
    }
  };

  return (
    <div className="space-y-6 font-mono relative">
      {/* Header Section */}
      <div className="border-b border-cyan-500/20 pb-4">
        <h1 className="text-2xl font-black uppercase tracking-wider bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-white bg-clip-text text-transparent">
          Order Management
        </h1>
        <p className="text-slate-400 text-xs mt-1">Track customer orders and manage fulfillment status</p>
      </div>

      {/* Delete Confirmation Modal for Orders */}
      {deletingOrderId && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md p-4">
          <div className="bg-[#080813] border-2 border-rose-500/80 rounded-xl p-5 shadow-[0_0_30px_rgba(244,63,94,0.35)] space-y-4">
            <div className="flex items-center space-x-2 text-rose-400 font-bold uppercase text-xs">
              <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
              <span>[SYSTEM WARNING]: Permanent Deletion</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to permanently delete this order? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setDeletingOrderId(null)}
                className="px-3 py-1.5 bg-[#030308] border border-slate-800 text-slate-400 hover:text-white rounded-lg text-xs font-bold transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteOrder(deletingOrderId)}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition-all shadow-[0_0_12px_rgba(244,63,94,0.4)]"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-[#080813] border border-cyan-500/20 p-4 rounded-xl flex flex-col md:flex-row gap-4 shadow-[0_0_15px_rgba(34,211,238,0.05)]">
        <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2">
          <input
            type="text"
            placeholder="Search by Order #, Customer Name, or Phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-[#030308] border border-slate-800 rounded-lg px-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all placeholder:text-slate-600"
          />
          <button
            type="submit"
            className="bg-cyan-600/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/30 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_10px_rgba(34,211,238,0.15)]"
          >
            Search
          </button>
          {activeSearch && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="bg-slate-800/80 text-slate-300 border border-slate-700 hover:bg-slate-700 px-3 py-2 rounded-lg text-xs font-bold transition-all"
            >
              Clear
            </button>
          )}
        </form>

        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="bg-[#030308] border border-slate-800 rounded-lg px-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
        >
          <option value="" className="bg-[#030308] text-slate-200">
            All Statuses
          </option>
          <option value="pending" className="bg-[#030308] text-slate-200">
            Pending
          </option>
          <option value="processing" className="bg-[#030308] text-slate-200">
            Processing
          </option>
          <option value="shipped" className="bg-[#030308] text-slate-200">
            Shipped
          </option>
          <option value="delivered" className="bg-[#030308] text-slate-200">
            Delivered
          </option>
          <option value="cancelled" className="bg-[#030308] text-slate-200">
            Cancelled
          </option>
        </select>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="p-8 text-center text-slate-400 text-xs">Loading orders...</div>
      ) : error ? (
        <div className="p-3 bg-rose-950/40 border border-rose-500/40 rounded-lg text-rose-300 text-xs flex items-center space-x-2">
          <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
          <span>[ERROR]: {error}</span>
        </div>
      ) : orders.length === 0 ? (
        <div className="p-8 text-center text-slate-500 bg-[#080813] border border-slate-800/80 rounded-xl text-xs">
          No orders found.
        </div>
      ) : (
        <div className="bg-[#080813] border border-cyan-500/20 rounded-xl overflow-hidden shadow-[0_0_15px_rgba(34,211,238,0.05)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#030308] text-cyan-300 uppercase text-[10px] tracking-wider border-b border-slate-800/80">
                <tr>
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Payment</th>
                  <th className="p-4">Fulfillment Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-cyan-950/10 transition-colors">
                    <td className="p-4 font-bold text-slate-200">
                      #{order.orderNumber || order._id.slice(-6)}
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-slate-100">
                        {order.user?.name || order.shippingAddress?.name || 'Customer'}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {order.user?.email || order.shippingAddress?.phone}
                      </div>
                    </td>
                    <td className="p-4 font-bold text-fuchsia-400">৳{order.total}</td>
                    <td className="p-4 text-xs">
                      <span className={`font-semibold ${order.isPaid ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {order.isPaid ? 'Paid' : 'Unpaid (COD)'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-[10px] font-bold px-3 py-1 rounded-full border uppercase tracking-wider ${STATUS_BADGES[order.orderStatus]}`}
                      >
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <Link
                        to={`/admin/orders/${order._id}`}
                        className="text-xs bg-cyan-600/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/30 px-3 py-1.5 rounded-lg font-bold transition-all shadow-[0_0_10px_rgba(34,211,238,0.15)] inline-block"
                      >
                        Details
                      </Link>
                      <button
                        onClick={() => setDeletingOrderId(order._id)}
                        className="text-xs bg-rose-950/40 text-rose-400 border border-rose-500/30 hover:bg-rose-900/40 px-3 py-1.5 rounded-lg font-bold transition-all inline-block"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {pagination.pages > 1 && (
            <div className="p-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span>
                Showing Page {pagination.page} of {pagination.pages} ({pagination.total} total orders)
              </span>
              <div className="flex space-x-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  className="px-3 py-1.5 bg-[#030308] text-slate-300 border border-slate-800 rounded-lg hover:border-cyan-500/40 disabled:opacity-40 transition-all"
                >
                  Previous
                </button>
                <button
                  disabled={page === pagination.pages}
                  onClick={() => setPage((p) => Math.min(p + 1, pagination.pages))}
                  className="px-3 py-1.5 bg-[#030308] text-slate-300 border border-slate-800 rounded-lg hover:border-cyan-500/40 disabled:opacity-40 transition-all"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}