import React from 'react';

export default function FooterCard({ icon: Icon, title, description }) {
  return (
    <div className="relative overflow-hidden flex items-center gap-4 p-5 rounded-2xl bg-white/85 backdrop-blur-xl border border-slate-200/80 shadow-sm hover:border-blue-300 hover:shadow-md hover:-translate-y-1.5 transition-all duration-300 group">
      {/* Background Accent Glow on Hover */}
      <div className="absolute -right-10 -bottom-10 w-24 h-24 bg-blue-500/10 rounded-full blur-xl group-hover:bg-blue-500/20 transition-all duration-500" />

      {/* Animated Icon Box */}
      <div className="relative z-10 p-3.5 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 group-hover:scale-110 group-hover:bg-gradient-to-tr group-hover:from-blue-600 group-hover:to-sky-500 group-hover:text-white group-hover:border-transparent transition-all duration-300 shadow-xs">
        <Icon className="w-5 h-5" />
      </div>

      <div className="relative z-10">
        <h4 className="font-extrabold text-slate-900 text-xs tracking-tight group-hover:text-blue-600 transition-colors duration-200">
          {title}
        </h4>
        <p className="text-[11px] text-slate-600 font-medium mt-0.5 leading-snug">
          {description}
        </p>
      </div>
    </div>
  );
}