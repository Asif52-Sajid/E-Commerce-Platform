import React from 'react';
import { 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  Zap, 
  CheckCircle2, 
  Lock
} from 'lucide-react';

const VALUE_PROPS = [
  {
    icon: Truck,
    title: 'Express Worldwide Shipping',
    subtitle: 'Tracked directly to your door',
    badge: 'Lightning Fast',
    color: 'from-blue-500/10 to-indigo-500/10 text-blue-600',
    borderColor: 'hover:border-blue-500/40',
    glowColor: 'group-hover:shadow-blue-500/10',
    accentDot: 'bg-blue-500',
  },
  {
    icon: ShieldCheck,
    title: 'Verified Quality Standards',
    subtitle: 'Hand-inspected before dispatch',
    badge: '100% Guaranteed',
    color: 'from-emerald-500/10 to-teal-500/10 text-emerald-600',
    borderColor: 'hover:border-emerald-500/40',
    glowColor: 'group-hover:shadow-emerald-500/10',
    accentDot: 'bg-emerald-500',
  },
  {
    icon: RotateCcw,
    title: '30-Day Risk-Free Returns',
    subtitle: 'Hassle-free instant refunds',
    badge: 'Zero Risk',
    color: 'from-purple-500/10 to-pink-500/10 text-purple-600',
    borderColor: 'hover:border-purple-500/40',
    glowColor: 'group-hover:shadow-purple-500/10',
    accentDot: 'bg-purple-500',
  },
  {
    icon: Lock,
    title: '256-Bit Encrypted Checkout',
    subtitle: 'Bank-grade transaction security',
    badge: 'Safe & Secure',
    color: 'from-cyan-500/10 to-teal-500/10 text-cyan-600',
    borderColor: 'hover:border-cyan-500/40',
    glowColor: 'group-hover:shadow-cyan-500/10',
    accentDot: 'bg-cyan-500',
  },
];

export default function SmartShoppingSection() {
  return (
    <section className="py-10 lg:py-12 bg-white border-b border-slate-200/80 relative overflow-hidden select-none">
      
      {/* Subtle Keyframe Animations for Micro-Interactions */}
      <style>{`
        @keyframes subtleGlowPulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.4; }
          50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.7; }
        }
        @keyframes borderScan {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        @keyframes floatParticle {
          0%, 100% { transform: translateY(0px); opacity: 0.3; }
          50% { transform: translateY(-10px); opacity: 0.8; }
        }

        .animate-glow-pulse { animation: subtleGlowPulse 10s ease-in-out infinite; }
        .animate-border-scan { animation: borderScan 6s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
        .animate-float-1 { animation: floatParticle 5s ease-in-out infinite; }
        .animate-float-2 { animation: floatParticle 7s ease-in-out infinite 1.5s; }

        @media (prefers-reduced-motion: reduce) {
          .animate-glow-pulse, .animate-border-scan, .animate-float-1, .animate-float-2 {
            animation: none !important;
          }
        }
      `}</style>

      {/* BACKGROUND ATMOSPHERE */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Soft Center Ambient Light Cloud */}
        <div className="absolute top-1/2 left-1/2 w-[50rem] h-[25rem] bg-cyan-500/10 rounded-full blur-[130px] animate-glow-pulse" />

        {/* Minimalist Micro-Grid */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle, #0f172a 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
          }}
        />

        {/* Subtle Ambient Particles */}
        <div className="absolute top-1/4 left-1/6 w-2 h-2 rounded-full bg-cyan-500/40 animate-float-1" />
        <div className="absolute bottom-1/3 right-1/5 w-2.5 h-2.5 rounded-full bg-teal-500/40 animate-float-2" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-cyan-700 text-[11px] font-black uppercase tracking-wider mb-2.5 shadow-xs backdrop-blur-md">
            <Zap className="w-3.5 h-3.5 text-cyan-600 animate-pulse" />
            <span>The ShopNex Promise</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            Designed around <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600">how you shop.</span>
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-1.5 leading-relaxed">
            We cut out unnecessary friction so you get premium products delivered with maximum security and absolute confidence.
          </p>
        </div>

        {/* 4-Column Animated Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {VALUE_PROPS.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div
                key={idx}
                className={`group relative rounded-2xl bg-white border border-slate-200 p-5 flex flex-col justify-between shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 backdrop-blur-md overflow-hidden ${item.borderColor} ${item.glowColor}`}
              >
                {/* Moving Highlight Beam on Card Hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                  <div className="w-full h-full bg-gradient-to-r from-transparent via-slate-100/50 to-transparent animate-border-scan" />
                </div>

                <div>
                  {/* Card Header: Icon + Badge */}
                  <div className="flex items-center justify-between mb-5">
                    
                    {/* Icon Container */}
                    <div className={`relative p-2.5 rounded-xl bg-gradient-to-br ${item.color} shadow-sm group-hover:scale-105 transition-transform duration-300 ease-out`}>
                      <IconComponent className="w-5 h-5 transform group-hover:rotate-6 transition-transform duration-300" />
                      <span className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${item.accentDot} ring-2 ring-white group-hover:animate-ping`} />
                    </div>

                    {/* Badge */}
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-800 backdrop-blur-sm group-hover:bg-slate-900 group-hover:text-white transition-colors duration-300">
                      {item.badge}
                    </span>
                  </div>

                  {/* Card Main Body */}
                  <div className="space-y-1">
                    <h3 className="text-sm font-black text-slate-900 group-hover:text-cyan-600 transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-slate-600 font-semibold leading-relaxed">
                      {item.subtitle}
                    </p>
                  </div>
                </div>

                {/* Card Interactive Footer */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-700 group-hover:text-slate-900 transition-colors duration-300">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 group-hover:scale-110 transition-transform" />
                    <span>Standard on all orders</span>
                  </div>
                  
                  {/* Arrow Accent */}
                  <span className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-300 text-cyan-600 font-black">
                    →
                  </span>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}