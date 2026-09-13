import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';

export default function CartBadgeButton({ count = 0, onClick }) {
  const [isBouncing, setIsBouncing] = useState(false);

  // Trigger pop/bounce animation whenever the count changes and is > 0
  useEffect(() => {
    if (count > 0) {
      setIsBouncing(true);
      const timer = setTimeout(() => setIsBouncing(false), 400);
      return () => clearTimeout(timer);
    }
  }, [count]);

  const displayCount = count > 99 ? '99+' : count;

  return (
    <Link
      to="/cart"
      onClick={onClick}
      className="group relative inline-flex items-center justify-center p-2.5 rounded-xl text-surface-800 hover:text-emerald-600 hover:bg-emerald-50/60 transition-all duration-300 ease-out active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 select-none"
      aria-label={`Shopping Cart with ${count} items`}
    >
      {/* Background Radial Ambient Glow */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 scale-50 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 ease-out blur-xs" />

      {/* Cart Icon - Subtly tilts & scales on hover or count change */}
      <ShoppingBag
        className={`w-5 h-5 relative z-10 transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110 ${
          isBouncing ? 'animate-bounce text-emerald-600' : ''
        }`}
      />

      {/* Dynamic Animated Badge */}
      {count > 0 && (
        <div className="absolute -top-0.5 -right-0.5 z-20 flex items-center justify-center">
          {/* Subtle Outer Pulse Ring */}
          <span className="absolute inset-0 rounded-full bg-emerald-400 opacity-75 animate-ping" />

          {/* Badge Capsule Container */}
          <span
            className={`relative min-w-[18px] h-[18px] px-1 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white font-black text-[10px] leading-none flex items-center justify-center shadow-lg shadow-emerald-500/30 border-2 border-surface-50 group-hover:scale-110 transition-transform duration-300 ${
              isBouncing ? 'scale-125' : 'scale-100'
            }`}
          >
            {displayCount}
          </span>
        </div>
      )}
    </Link>
  );
}