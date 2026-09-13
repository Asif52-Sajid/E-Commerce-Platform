import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Menu, X, LogOut, ShieldCheck, ArrowRight } from 'lucide-react';
import Logo from '../../common/Logo';
import SearchBar from '../../common/SearchBar';
import NavItem from '../../common/NavItem';
import CartBadgeButton from '../../common/CartBadgeButton';
import WishlistBadgeButton from '../../common/WishlistBadgeButton';
import MobileMenu from '../../common/MobileMenu';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const closeMenu = () => setIsMobileMenuOpen(false);

  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { totalCount } = useCart();
  const { totalWishlistCount } = useWishlist();
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    // Prevent navigating to /profile when clicking the logout button
    e.stopPropagation();
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all duration-300 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <Logo size="md" />

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <SearchBar />
          </div>

          {/* Navigation & Action Controls - Desktop & Tablet (md:flex) */}
          <div className="hidden md:flex items-center gap-5">
            <NavItem to="/products">Explore Products</NavItem>

            <div className="h-4 w-[1px] bg-slate-200" />

            {/* Badge Buttons - Connected to Live Context Counts */}
            <WishlistBadgeButton count={totalWishlistCount} />
            <CartBadgeButton count={totalCount} />

            {/* Animated User Controls */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2.5">
                {/* User Profile Badge -> Clickable Link to /profile on Desktop/Tablet */}
                <Link
                  to="/profile"
                  className="group relative flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100/90 border border-slate-200/90 shadow-xs hover:shadow-md hover:border-cyan-500/50 transition-all duration-300 cursor-pointer select-none"
                >
                  <div className="relative flex items-center justify-center w-7 h-7 rounded-full bg-cyan-500/10 border border-cyan-500/20 group-hover:scale-110 group-hover:bg-cyan-500/20 transition-all duration-300">
                    {isAdmin ? (
                      <ShieldCheck className="w-4 h-4 text-cyan-600 group-hover:rotate-12 transition-transform duration-300" />
                    ) : (
                      <User className="w-4 h-4 text-cyan-600 group-hover:rotate-12 transition-transform duration-300" />
                    )}
                    {/* Live Status Pulse */}
                    <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                    </span>
                  </div>

                  <span className="text-xs font-bold text-slate-900 group-hover:text-cyan-600 transition-colors duration-200">
                    {user?.name}
                  </span>

                  {isAdmin && (
                    <span className="px-1.5 py-0.5 text-[9px] bg-cyan-500/10 text-cyan-700 rounded-full font-black uppercase tracking-wider border border-cyan-500/20">
                      Admin
                    </span>
                  )}
                </Link>

                {/* Logout Button (Right Side) */}
                <button
                  onClick={handleLogout}
                  className="group relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-50/80 border border-rose-200/80 hover:bg-rose-500 hover:border-rose-500 hover:shadow-md hover:shadow-rose-500/20 text-xs font-bold text-rose-600 hover:text-white transition-all duration-300 active:scale-95 overflow-hidden cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5 group-hover:-translate-x-0.5 group-hover:rotate-12 transition-transform duration-300" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              /* Animated Sign-In Button */
              <Link
                to="/login"
                className="group relative inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-slate-100 to-white border border-slate-200 hover:border-cyan-500/60 text-xs font-bold text-slate-900 shadow-xs hover:shadow-md transition-all duration-300 active:scale-95 overflow-hidden cursor-pointer"
              >
                {/* Shimmer Effect */}
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                
                <div className="relative flex items-center justify-center w-5 h-5 rounded-full bg-cyan-500/10 text-cyan-600 group-hover:bg-cyan-600 group-hover:text-white transition-colors duration-300">
                  <User className="w-3 h-3 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <span>Sign In</span>
                <ArrowRight className="w-3 h-3 text-slate-600 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300" />
              </Link>
            )}
          </div>

          {/* Hamburger Toggle - Mobile Only */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 hover:text-slate-900 transition-colors cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={closeMenu}
        cartCount={totalCount}
        wishlistCount={totalWishlistCount}
      />
    </header>
  );
}