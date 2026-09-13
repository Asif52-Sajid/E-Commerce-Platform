import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Star } from 'lucide-react';

const navItems = [
  {
    label: 'Dashboard',
    path: '/admin',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    label: 'Products',
    path: '/admin/products',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
  {
    label: 'Categories',
    path: '/admin/categories',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  },
  {
    label: 'Orders',
    path: '/admin/orders',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
  },
  {
    label: 'Inventory',
    path: '/admin/inventory',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    label: 'Users',
    path: '/admin/users',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
  {
    label: 'Reviews',
    path: '/admin/reviews',
    icon: <Star className="w-4 h-4" />,
  },
];

export default function AdminSidebar({ isOpen, setIsOpen }) {
  return (
    <>
      {/* Mobile backdrop overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-[#030308]/80 backdrop-blur-md z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 w-64 bg-[#080813] border-r border-cyan-500/20 z-50 flex flex-col transition-transform duration-300 ease-out shadow-[5px_0_25px_rgba(6,182,212,0.1)] lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header Section */}
        <div className="h-14 px-4 border-b border-cyan-500/20 flex items-center justify-between">
          <Link to="/admin" className="group flex items-center space-x-2.5">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-fuchsia-600 shadow-[0_0_12px_rgba(34,211,238,0.4)] transition-transform duration-300 group-hover:scale-105">
              <span className="text-white font-mono font-black text-sm">A</span>
            </div>
            <div>
              <span className="text-base font-black font-mono tracking-wider bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-emerald-300 bg-clip-text text-transparent">
                ADMIN
              </span>
              <span className="block text-[9px] font-mono font-bold text-cyan-400 tracking-widest uppercase -mt-1">
                PORTAL
              </span>
            </div>
          </Link>

          {/* Mobile Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close Sidebar"
            className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg bg-[#030308] border border-slate-800 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `group relative flex items-center px-3 py-2 rounded-lg text-xs font-mono font-semibold transition-all duration-200 overflow-hidden ${
                  isActive
                    ? 'text-white shadow-[0_0_15px_rgba(34,211,238,0.25)]'
                    : 'text-slate-400 hover:text-cyan-300 hover:translate-x-1'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Neon active gradient background */}
                  {isActive ? (
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-fuchsia-600 rounded-lg" />
                  ) : (
                    <div className="absolute inset-0 bg-transparent group-hover:bg-[#0c0c1e] rounded-lg transition-colors" />
                  )}

                  {/* Active Indicator Line */}
                  {isActive && (
                    <div className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-cyan-300 rounded-r shadow-[0_0_8px_rgba(34,211,238,0.9)]" />
                  )}

                  {/* Icon & Label */}
                  <span
                    className={`relative z-10 mr-2.5 transition-colors ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-cyan-400'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="relative z-10 uppercase tracking-wider">{item.label}</span>

                  {/* Hover Accent Dot */}
                  {!isActive && (
                    <span className="absolute right-2.5 w-1 h-1 rounded-full bg-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_6px_rgba(34,211,238,0.8)]" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer Section */}
        <div className="p-3 border-t border-cyan-500/20 bg-[#030308]/60">
          <Link
            to="/"
            className="group relative flex items-center justify-center w-full py-2 px-3 rounded-lg bg-[#030308] hover:bg-[#0c0c1e] border border-cyan-500/30 hover:border-cyan-400 text-slate-300 hover:text-white text-xs font-mono font-bold transition-all duration-200"
          >
            <svg
              className="w-3.5 h-3.5 mr-2 text-cyan-400 transition-transform duration-200 group-hover:-translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="relative z-10 uppercase tracking-wider">[Back to Shop]</span>
          </Link>
        </div>
      </aside>
    </>
  );
}