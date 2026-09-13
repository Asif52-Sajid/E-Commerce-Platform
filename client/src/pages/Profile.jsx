import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Shield, Calendar, LogOut, User, CheckCircle2, ArrowLeft, PackageCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Profile() {
  const { user, logout } = useAuth();

  return (
    <div className="bg-surface-50 text-surface-900 py-8 px-4 flex items-center justify-center">
      <div className="w-full max-w-md space-y-4">
        
        {/* Navigation & Status Header */}
        <div className="flex items-center justify-between text-xs">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 font-bold text-surface-800 hover:text-brand-500 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Store</span>
          </Link>

          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 font-semibold text-[11px]">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Active Session</span>
          </span>
        </div>

        {/* Compact Card Container */}
        <div className="bg-surface-100 border border-surface-200 rounded-2xl p-5 shadow-md space-y-5">
          
          {/* Header Profile Info */}
          <div className="flex items-center gap-3.5 pb-4 border-b border-surface-200">
            <div className="relative flex-shrink-0">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500/10 to-tealAccent-500/20 border border-brand-500/30 flex items-center justify-center text-brand-500 font-black text-xl">
                {user?.name?.charAt(0).toUpperCase() || <User className="w-5 h-5" />}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tealAccent-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-tealAccent-500 border-2 border-surface-100" />
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <h1 className="text-lg font-black tracking-tight text-surface-900 truncate">
                {user?.name}
              </h1>
              <span className="inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-brand-50 text-brand-500 border border-brand-100 rounded-md">
                {user?.role || 'Member'} Account
              </span>
            </div>
          </div>

          {/* Account Details List */}
          <div className="space-y-2">
            {/* Email Row */}
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-surface-50 border border-surface-200/80">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-brand-50 text-brand-500 border border-brand-100 flex-shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold text-surface-800 uppercase">Email</p>
                <p className="text-xs font-extrabold text-surface-900 truncate">{user?.email}</p>
              </div>
            </div>

            {/* Account Role Row */}
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-surface-50 border border-surface-200/80">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-tealAccent-500/10 text-tealAccent-500 border border-tealAccent-500/20 flex-shrink-0">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-surface-800 uppercase">Role</p>
                <p className="text-xs font-extrabold text-surface-900 capitalize">{user?.role || 'Standard'}</p>
              </div>
            </div>

            {/* Member Since Row */}
            {user?.createdAt && (
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-surface-50 border border-surface-200/80">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-brand-50 text-brand-500 border border-brand-100 flex-shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-surface-800 uppercase">Member Since</p>
                  <p className="text-xs font-extrabold text-surface-900">
                    {new Date(user.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* My Orders Navigation Button Added Here */}
          <div className="pt-1">
            <Link
              to="/my-orders"
              className="flex items-center justify-between w-full py-3 px-3.5 bg-brand-500/10 hover:bg-brand-500/20 border border-brand-500/30 text-brand-500 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all duration-200 active:scale-95 group"
            >
              <div className="flex items-center gap-2">
                <PackageCheck className="w-4 h-4 text-brand-500" />
                <span>My Orders History</span>
              </div>
              <span className="text-brand-400 group-hover:translate-x-0.5 transition-transform">→</span>
            </Link>
          </div>

          {/* Logout Button */}
          <div className="pt-2">
            <button
              onClick={logout}
              className="flex items-center justify-center gap-2 w-full py-2.5 px-3 bg-red-50 hover:bg-red-500 border border-red-200 hover:border-red-500 text-red-600 hover:text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all duration-200 active:scale-95"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}