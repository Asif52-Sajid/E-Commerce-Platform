import React from 'react';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';
import NavItem from './NavItem';
import { useAuth } from '../context/AuthContext';
import { LogOut, ShieldCheck, User, ArrowRight, UserCheck, ChevronRight } from 'lucide-react';

export default function MobileMenu({ 
  isOpen, 
  onClose, 
  cartCount = 0, 
  wishlistCount = 0 
}) {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  if (!isOpen) return null;

  const handleLogout = async () => {
    await logout();
    onClose();
  };

  return (
    <div className="fixed inset-x-4 top-22 z-50 md:hidden animate-in fade-in slide-in-from-top-3 duration-300 ease-out">
      {/* Floating Glassmorphism Container */}
      <div className="rounded-2xl bg-surface-50/95 p-4 shadow-2xl backdrop-blur-xl border border-surface-200/80 ring-1 ring-black/5 space-y-3.5">
        
        {/* 1. TOP: Search Bar */}
        <div>
          <SearchBar onSearchComplete={onClose} />
        </div>

        {/* 2. MIDDLE (Below Search): Profile & Account Actions */}
        <div className="pt-0.5">
          {isAuthenticated ? (
            /* Authenticated User: Left Profile Info + Right Logout Button */
            <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-surface-100/90 border border-surface-200/80 shadow-sm">
              
              {/* Left: Avatar & User Name (Clickable link to Profile with Enhanced Dynamic Button) */}
              <Link 
                to="/profile" 
                onClick={onClose}
                className="group flex items-center gap-2.5 min-w-0 px-1 transition-all duration-300"
              >
                <div className="relative flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-tealAccent-500/10 border border-tealAccent-500/20 text-tealAccent-500 group-hover:border-cyan-400/60 group-hover:shadow-[0_0_12px_rgba(6,182,212,0.3)] transition-all">
                  {isAdmin ? (
                    <ShieldCheck className="w-4 h-4 text-brand-500 animate-pulse" />
                  ) : (
                    <User className="w-4 h-4 text-tealAccent-500 group-hover:text-cyan-400 transition-colors" />
                  )}
                  <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                </div>
                
                <div className="truncate">
                  <p className="text-xs font-bold text-surface-900 group-hover:text-cyan-600 transition-colors truncate">{user?.name}</p>
                  {isAdmin ? (
                    <span className="text-[9px] font-black uppercase tracking-wider text-brand-500 block -mt-0.5">
                      Admin
                    </span>
                  ) : (
                    /* Stylized & Animated View Profile Badge */
                    <div className="inline-flex items-center gap-1 mt-0.5 px-2 py-0.5 rounded-md bg-cyan-950/20 border border-cyan-500/30 text-[9px] font-extrabold uppercase tracking-wider text-cyan-600 group-hover:text-cyan-400 group-hover:bg-cyan-900/40 group-hover:border-cyan-400/60 group-hover:shadow-[0_0_10px_rgba(6,182,212,0.25)] transition-all duration-300">
                      <span>View Profile</span>
                      <ChevronRight className="w-2.5 h-2.5 text-cyan-500 group-hover:translate-x-0.5 transition-transform duration-300" />
                    </div>
                  )}
                </div>
              </Link>

              {/* Right: Logout Button */}
              <button
                onClick={handleLogout}
                className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 border border-red-200/80 hover:bg-red-500 hover:border-red-500 text-xs font-bold text-red-600 hover:text-white transition-all duration-200 active:scale-95"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            /* Guest User: Sign In Card */
            <Link
              to="/login"
              onClick={onClose}
              className="group relative flex items-center justify-between w-full p-2.5 rounded-xl bg-gradient-to-r from-surface-100 via-surface-50 to-surface-100 border border-surface-200/80 hover:border-tealAccent-500/50 text-xs font-bold text-surface-900 shadow-sm transition-all duration-300 active:scale-98 overflow-hidden"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-tealAccent-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
              <div className="flex items-center gap-2.5">
                <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-tealAccent-500/10 text-tealAccent-500">
                  <User className="w-4 h-4" />
                </div>
                <span>Sign In / Account</span>
              </div>
              <ArrowRight className="w-4 h-4 text-surface-800 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
            </Link>
          )}
        </div>

        {/* Divider */}
        <hr className="border-surface-200/60" />

        {/* 3. BOTTOM: Navigation Section */}
        <nav className="space-y-1">
          <NavItem to="/products" mobile onClick={onClose}>
            <span className="flex items-center gap-3">
              <CompassIcon />
              <span>Explore Products</span>
            </span>
          </NavItem>
          
          <NavItem to="/wishlist" mobile badge={wishlistCount} onClick={onClose}>
            <span className="flex items-center gap-3">
              <HeartIcon />
              <span>My Wishlist</span>
            </span>
          </NavItem>

          <NavItem to="/cart" mobile badge={cartCount} onClick={onClose}>
            <span className="flex items-center gap-3">
              <CartIcon />
              <span>Shopping Cart</span>
            </span>
          </NavItem>

          {isAuthenticated && (
            <NavItem to="/profile" mobile onClick={onClose}>
              <span className="flex items-center gap-3">
                <UserCheck className="w-5 h-5 opacity-75" />
                <span>My Profile</span>
              </span>
            </NavItem>
          )}
        </nav>

      </div>
    </div>
  );
}

/* Helper SVG Icons */

function CompassIcon() {
  return (
    <svg className="w-5 h-5 opacity-75" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 13.5l1-4 4-1-1 4-4 1z" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg className="w-5 h-5 opacity-75" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg className="w-5 h-5 opacity-75" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
  );
}