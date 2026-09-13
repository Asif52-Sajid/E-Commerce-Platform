import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import adminService from '../../services/adminService';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsRes, ordersRes, stockRes] = await Promise.all([
          adminService.getDashboardStats(),
          adminService.getRecentOrders(),
          adminService.getLowStockProducts(),
        ]);

        setStats(statsRes.data);
        setRecentOrders(ordersRes.data || []);
        setLowStock(stockRes.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard metrics');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20 animate-ping" />
          <div className="w-12 h-12 rounded-full border-2 border-t-cyan-400 border-r-fuchsia-500 border-b-emerald-400 border-l-transparent animate-spin" />
        </div>
        <p className="text-cyan-400 font-mono tracking-widest text-xs uppercase animate-pulse">
          Loading Data...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-rose-950/80 border border-rose-500/50 rounded-xl text-rose-300 flex items-center justify-between backdrop-blur-md shadow-[0_0_15px_rgba(244,63,94,0.2)]">
        <div className="flex items-center space-x-2.5 text-xs font-mono">
          <span className="text-rose-400">⚠️</span>
          <span>{error}</span>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-lg transition-all"
        >
          Retry
        </button>
      </div>
    );
  }

  const statCards = [
    {
      label: 'Total Revenue',
      value: `৳${(stats?.totalRevenue || 0).toLocaleString()}`,
      accentColor: 'border-emerald-500/30 group-hover:border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]',
      textColor: 'text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]',
      iconBg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: 'Total Orders',
      value: stats?.totalOrders || 0,
      accentColor: 'border-cyan-500/30 group-hover:border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]',
      textColor: 'text-cyan-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]',
      iconBg: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
    },
    {
      label: 'Pending Orders',
      value: stats?.pendingOrders || 0,
      accentColor: 'border-fuchsia-500/30 group-hover:border-fuchsia-400 shadow-[0_0_15px_rgba(217,70,239,0.15)]',
      textColor: 'text-fuchsia-400 drop-shadow-[0_0_10px_rgba(232,121,249,0.5)]',
      iconBg: 'bg-fuchsia-500/10 border-fuchsia-500/30 text-fuchsia-400',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: 'Low Stock Alerts',
      value: stats?.lowStockProducts || 0,
      accentColor: 'border-amber-500/30 group-hover:border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.15)]',
      textColor: 'text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]',
      iconBg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
    },
    {
      label: 'Total Products',
      value: stats?.totalProducts || 0,
      accentColor: 'border-violet-500/30 group-hover:border-violet-400 shadow-[0_0_15px_rgba(139,92,246,0.15)]',
      textColor: 'text-violet-300 drop-shadow-[0_0_10px_rgba(167,139,250,0.5)]',
      iconBg: 'bg-violet-500/10 border-violet-500/30 text-violet-400',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
    },
    {
      label: 'Total Users',
      value: stats?.totalUsers || 0,
      accentColor: 'border-cyan-500/30 group-hover:border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]',
      textColor: 'text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]',
      iconBg: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="relative min-h-screen bg-[#030308] text-slate-100 p-4 lg:p-6 space-y-5 overflow-hidden">
      
      {/* Neon Grid Glow Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a15_1px,transparent_1px),linear-gradient(to_bottom,#0f172a15_1px,transparent_1px)] bg-[size:2rem_2rem]" />
      </div>

      <div className="relative z-10 space-y-5">
        {/* Compact Header */}
        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
          <div>
            <h1 className="text-2xl font-black tracking-wider uppercase bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-emerald-400 bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(34,211,238,0.4)]">
              Admin Dashboard
            </h1>
            <p className="text-slate-400 text-xs font-mono mt-0.5 flex items-center space-x-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
              </span>
              <span>LIVE SYSTEM MONITORING</span>
            </p>
          </div>
        </div>

        {/* Compact Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {statCards.map((card, idx) => (
            <div
              key={idx}
              className={`group relative overflow-hidden bg-[#080813]/80 backdrop-blur-md border ${card.accentColor} p-4 rounded-xl transition-all duration-300 hover:-translate-y-0.5`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                    {card.label}
                  </p>
                  <p className={`text-2xl font-black mt-1 font-mono tracking-tight ${card.textColor}`}>
                    {card.value}
                  </p>
                </div>
                <div className={`p-2.5 rounded-lg border ${card.iconBg} group-hover:scale-105 transition-transform duration-300`}>
                  {card.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Panels Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Recent Orders Panel */}
          <div className="lg:col-span-2 bg-[#080813]/80 backdrop-blur-md border border-cyan-500/20 rounded-xl p-4 shadow-[0_0_20px_rgba(6,182,212,0.05)]">
            <div className="flex items-center justify-between mb-3 border-b border-slate-800/80 pb-2.5">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                <h2 className="text-sm font-bold font-mono tracking-wider text-slate-200 uppercase">
                  Recent Orders
                </h2>
              </div>
              <Link
                to="/admin/orders"
                className="group flex items-center space-x-1 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <span>[View All]</span>
              </Link>
            </div>

            {recentOrders.length === 0 ? (
              <div className="py-8 text-center bg-[#030308]/50 rounded-lg border border-slate-800/50">
                <p className="text-slate-500 text-xs font-mono">No recent orders recorded.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {recentOrders.map((order) => (
                  <div
                    key={order._id}
                    className="group flex items-center justify-between p-2.5 bg-[#030308]/60 hover:bg-[#0c0c1e] rounded-lg text-xs border border-slate-800/80 hover:border-cyan-500/40 transition-all duration-200"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-1.5 bg-cyan-500/10 border border-cyan-500/30 rounded text-cyan-400">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                      </div>
                      <div>
                        <span className="font-mono text-slate-200 font-bold group-hover:text-cyan-300 transition-colors">
                          #{order.orderNumber || order._id.slice(-6)}
                        </span>
                        <p className="text-[11px] text-slate-400">{order.user?.name || 'Customer'}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-mono font-bold text-slate-100">৳{order.total}</p>
                      <span className="inline-block text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 mt-0.5">
                        {order.orderStatus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Low Stock Panel */}
          <div className="bg-[#080813]/80 backdrop-blur-md border border-amber-500/20 rounded-xl p-4 shadow-[0_0_20px_rgba(245,158,11,0.05)]">
            <div className="flex items-center justify-between mb-3 border-b border-slate-800/80 pb-2.5">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                <h2 className="text-sm font-bold font-mono tracking-wider text-slate-200 uppercase">
                  Low Stock
                </h2>
              </div>
              <Link
                to="/admin/inventory"
                className="group flex items-center space-x-1 text-xs font-mono text-amber-400 hover:text-amber-300 transition-colors"
              >
                <span>[Manage]</span>
              </Link>
            </div>

            {lowStock.length === 0 ? (
              <div className="py-8 text-center bg-[#030308]/50 rounded-lg border border-slate-800/50">
                <p className="text-slate-500 text-xs font-mono">Stock levels normal.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {lowStock.map((prod) => (
                  <div
                    key={prod._id}
                    className="group flex items-center justify-between p-2.5 bg-[#030308]/60 hover:bg-[#0c0c1e] rounded-lg text-xs border border-slate-800/80 hover:border-amber-500/40 transition-all duration-200"
                  >
                    <div className="flex items-center space-x-2.5 truncate mr-2">
                      <div className="p-1.5 bg-amber-500/10 border border-amber-500/30 rounded text-amber-400 shrink-0">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                      <span className="font-semibold text-slate-200 truncate group-hover:text-amber-300 transition-colors">
                        {prod.name}
                      </span>
                    </div>

                    <span className="shrink-0 font-mono text-[10px] font-bold text-amber-400 bg-amber-950/60 border border-amber-500/40 px-2 py-0.5 rounded">
                      {prod.stock} LEFT
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}