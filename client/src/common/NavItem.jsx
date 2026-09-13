import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function NavItem({ to, children, badge, onClick, mobile = false }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  if (mobile) {
    return (
      <Link
        to={to}
        onClick={onClick}
        className={`text-xs font-bold py-2.5 px-3 rounded-lg flex items-center justify-between transition-colors ${
          isActive
            ? 'bg-emerald-50 text-emerald-600'
            : 'text-surface-800 hover:text-emerald-600 hover:bg-surface-100'
        }`}
      >
        <span>{children}</span>
        {badge !== undefined && badge > 0 && (
          <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold shadow-sm">
            {badge}
          </span>
        )}
      </Link>
    );
  }

  return (
    <Link
      to={to}
      className={`text-xs font-bold tracking-wide transition-colors duration-200 relative py-1 ${
        isActive ? 'text-emerald-600' : 'text-surface-800 hover:text-emerald-600'
      }`}
    >
      {children}
      {isActive && (
        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-500 rounded-full animate-pulse" />
      )}
    </Link>
  );
}