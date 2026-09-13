import React from 'react';
import { useAuth } from '../../context/AuthContext';

export default function AdminHeader({ onToggleSidebar }) {
  const { user, logout } = useAuth();

  return (
    <header className="h-14 bg-[#030308]/90 backdrop-blur-md border-b border-cyan-500/20 px-4 lg:px-6 flex items-center justify-between sticky top-0 z-30 transition-all duration-300 lg:pl-72">
      {/* Left Section: Mobile Toggle & System Badge */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onToggleSidebar}
          aria-label="Toggle Sidebar"
          className="lg:hidden p-1.5 text-cyan-400 hover:text-white rounded-lg bg-[#080813] hover:bg-[#0c0c1e] border border-cyan-500/30 transition-all duration-200 active:scale-95"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Neon Status Badge */}
        <div className="relative group cursor-default">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-full blur-sm opacity-40 group-hover:opacity-100 transition duration-300" />
          <div className="relative flex items-center space-x-2 bg-[#080813] border border-cyan-500/30 px-3 py-1 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
            </span>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-gradient-to-r from-cyan-300 to-fuchsia-300 bg-clip-text text-transparent">
              System Admin
            </span>
          </div>
        </div>
      </div>

      {/* Right Section: User Profile & Logout */}
      <div className="flex items-center space-x-3">
        {/* User Card */}
        <div className="hidden sm:flex items-center space-x-2 bg-[#080813] border border-slate-800 rounded-lg px-2.5 py-1">
          <div className="w-5 h-5 rounded bg-gradient-to-tr from-cyan-500 to-fuchsia-600 flex items-center justify-center text-[10px] font-mono font-bold text-white shadow-[0_0_8px_rgba(6,182,212,0.4)]">
            {(user?.name || user?.email || 'A').charAt(0).toUpperCase()}
          </div>
          <span className="text-xs font-mono text-slate-300 max-w-[130px] truncate">
            {user?.name || user?.email}
          </span>
        </div>

        {/* Neon Logout Button */}
        <button
          onClick={logout}
          className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg p-[1px] text-xs font-mono font-bold transition-all duration-200 hover:scale-105 active:scale-95"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-rose-600 to-fuchsia-600 transition-all duration-300 opacity-80 group-hover:opacity-100" />
          <span className="relative flex items-center space-x-1.5 rounded-[7px] bg-[#030308] px-2.5 py-1.5 transition-all duration-200 group-hover:bg-transparent">
            <svg className="w-3.5 h-3.5 text-rose-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="text-rose-400 group-hover:text-white transition-colors">
              Logout
            </span>
          </span>
        </button>
      </div>
    </header>
  );
}