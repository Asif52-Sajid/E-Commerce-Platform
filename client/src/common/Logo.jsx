import React from 'react';
import { Link } from 'react-router-dom';

export default function Logo({ size = 'md', showTagline = false }) {
  // Compact sizing map for perfect header alignment
  const sizeMap = {
    sm: {
      cart: 'w-7 h-7',
      text: 'text-2xl',
      tagline: 'text-[9px]',
    },
    md: {
      cart: 'w-8 h-8',
      text: 'text-3xl',
      tagline: 'text-[10px]',
    },
    lg: {
      cart: 'w-11 h-11',
      text: 'text-4xl',
      tagline: 'text-[12px]',
    },
  };

  const current = sizeMap[size] || sizeMap.md;

  return (
    <Link to="/" className="inline-flex items-center gap-2 group select-none">
      {/* Animated Speed-Cart Icon (Greenish & Cyan Palette) */}
      <div className={`relative ${current.cart} flex items-center justify-center shrink-0`}>
        {/* Soft Glow Effect on Hover */}
        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full opacity-0 group-hover:opacity-40 blur-sm transition-opacity duration-300"></div>

        <svg
          className="w-full h-full group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300 relative z-10 drop-shadow-sm"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Speed Motion Trails (Sliding Animation) */}
          <path
            d="M4 30H30M10 48H36M18 66H42"
            stroke="url(#shopnex-green-cyan-speed)"
            strokeWidth="7"
            strokeLinecap="round"
            className="group-hover:translate-x-2 transition-transform duration-300 ease-out"
          />

          {/* Cart Body (Gradient Fill) */}
          <path
            d="M30 20H90L78 62H42L30 20Z"
            fill="url(#shopnex-green-cyan-body)"
          />
          <path
            d="M16 12H28L40 64H82"
            stroke="#064e3b"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Inner Cutout Accents */}
          <line x1="45" y1="33" x2="84" y2="33" stroke="#ffffff" strokeWidth="4.5" strokeLinecap="round" opacity="0.9" />
          <line x1="43" y1="46" x2="80" y2="46" stroke="#ffffff" strokeWidth="4.5" strokeLinecap="round" opacity="0.9" />

          {/* Spinning Wheels on Hover */}
          <g className="group-hover:animate-spin origin-center" style={{ animationDuration: '2.5s' }}>
            <circle cx="46" cy="78" r="8" fill="#10b981" />
            <circle cx="46" cy="78" r="3" fill="#ffffff" />
            <circle cx="76" cy="78" r="8" fill="#06b6d4" />
            <circle cx="76" cy="78" r="3" fill="#ffffff" />
          </g>

          {/* Color Gradients */}
          <defs>
            <linearGradient id="shopnex-green-cyan-speed" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
            <linearGradient id="shopnex-green-cyan-body" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#059669" />
              <stop offset="100%" stopColor="#0891b2" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Script Typography in Vibrant Greenish & Cyan Gradient */}
      <div className="flex flex-col justify-center">
        <span
          className={`${current.text} font-black leading-none tracking-normal text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 group-hover:scale-105 group-hover:brightness-110 transition-all duration-300 drop-shadow-sm`}
          style={{ fontFamily: "'Pacifico', cursive" }}
        >
          ShopNex
          <span className="text-cyan-500 inline-block ml-0.5 animate-bounce">.</span>
        </span>

        {/* Optional Tagline (Hidden by default in Navbar, visible when showTagline={true}) */}
        {showTagline && (
          <span
            className={`${current.tagline} font-extrabold text-slate-700 tracking-[0.25em] uppercase mt-0.5 opacity-80`}
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            Express Store
          </span>
        )}
      </div>
    </Link>
  );
}