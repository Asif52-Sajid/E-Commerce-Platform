import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, ShieldCheck, Flame, Truck, PackageCheck, Globe2 } from 'lucide-react';

export default function PromotionalSection() {
  const handleScrollToTop = () => {
    window.scrollTo(0, 0);
  };

  return (
    <section className="py-8 bg-[#030712] relative overflow-hidden select-none">
      
      {/* Custom Keyframe Animations */}
      <style>{`
        @keyframes tickerScroll {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        @keyframes meshDrift {
          0% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(20px, -15px) scale(1.05); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes floatCard {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-6px) rotate(1deg); }
        }
        @keyframes shimmerFast {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }

        .animate-ticker-marquee { animation: tickerScroll 18s linear infinite; }
        .animate-ticker-marquee:hover { animation-play-state: paused; }
        .animate-mesh-1 { animation: meshDrift 12s ease-in-out infinite; }
        .animate-mesh-2 { animation: meshDrift 15s ease-in-out infinite reverse; }
        .animate-float-badge { animation: floatCard 4.5s ease-in-out infinite; }
        .animate-shimmer { animation: shimmerFast 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
      `}</style>

      {/* Background Neon Mesh & Grids */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[28rem] h-[28rem] bg-blue-600/15 rounded-full blur-[110px] animate-mesh-1" />
        <div className="absolute bottom-0 right-1/4 w-[28rem] h-[28rem] bg-sky-600/10 rounded-full blur-[110px] animate-mesh-2" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Redesigned Compact Glassmorphism Capsule Card */}
        <div className="relative rounded-3xl bg-gradient-to-br from-gray-900/90 via-slate-900/80 to-zinc-950/90 border border-white/10 shadow-[0_0_40px_-12px_rgba(59,130,246,0.2)] backdrop-blur-2xl overflow-hidden">
          
          {/* Top Edge Glow Line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-75" />

          {/* Top Moving Promotional Banner (Right to Left with Multiple Colors) */}
          <div className="w-full bg-slate-950/90 border-b border-blue-500/20 py-2 overflow-hidden relative z-20 backdrop-blur-md">
            <div className="flex whitespace-nowrap w-max animate-ticker-marquee">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-6 text-[11px] font-black uppercase tracking-wider mx-4">
                  <span className="flex items-center gap-1.5 text-cyan-400">
                    <Flame className="w-3.5 h-3.5 animate-pulse" />
                    FLASH DROP: 30% OFF SELECT GEAR
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="text-amber-400 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5" /> FREE EXPRESS SHIPPING OVER $99
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="text-emerald-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" /> 2-YEAR EXTENDED WARRANTY INCLUDED
                  </span>
                  <span className="text-slate-600">•</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 sm:p-10 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Content Area */}
            <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
              
              {/* Animated Glowing Pill Badge with New Icon */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-black uppercase tracking-widest backdrop-blur-md shadow-inner">
                <Globe2 className="w-3.5 h-3.5 text-blue-400 animate-spin" style={{ animationDuration: '8s' }} />
                <span>Next-Gen Drop • Limited Allocation</span>
              </div>

              {/* Bold Dynamic Heading with Blueish Palette */}
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.15]">
                Supercharge your ecosystem with <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-cyan-400 bg-clip-text text-transparent">
                  unmatched seasonal discounts.
                </span>
              </h2>

              {/* Descriptive Copy */}
              <p className="text-xs sm:text-sm text-gray-300 font-medium max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Handcrafted performance gear, immersive audio systems, and advanced tech accessories built to elevate your everyday workflow.
              </p>

              {/* Action Buttons with Shimmer Effect */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                <Link
                  to="/products?onSale=true"
                  onClick={handleScrollToTop}
                  className="relative group overflow-hidden px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-black text-xs shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 transition-all duration-300 active:scale-95 flex items-center gap-2.5"
                >
                  {/* Shimmer overlay */}
                  <div className="absolute inset-0 w-1/2 h-full bg-white/20 skew-x-12 animate-shimmer pointer-events-none" />
                  <span>Shop Promotional Drop</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>

                <Link
                  to="/products"
                  onClick={handleScrollToTop}
                  className="px-5 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold text-xs transition-all duration-300 active:scale-95 backdrop-blur-md shadow-2xs"
                >
                  Explore Full Catalog
                </Link>
              </div>

              {/* Trust Metric Micro-Bar */}
              <div className="pt-4 border-t border-white/10 grid grid-cols-3 gap-2 max-w-md mx-auto lg:mx-0 text-left">
                <div className="flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                  <span className="text-[11px] font-extrabold text-gray-300">Hot Deals</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="text-[11px] font-extrabold text-gray-300">2-Yr Warranty</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="text-[11px] font-extrabold text-gray-300">Instant Ship</span>
                </div>
              </div>

            </div>

            {/* Right Interactive Floating Visual Showcase */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-xs">
                
                {/* Outer Glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur-lg opacity-25 animate-pulse" />

                {/* Main Floating Card */}
                <div className="relative p-6 rounded-2xl bg-slate-950/80 border border-white/15 backdrop-blur-xl shadow-xl text-center space-y-4 animate-float-badge">
                  
                  {/* Icon Header */}
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/40 text-blue-400 flex items-center justify-center mx-auto shadow-inner">
                    <Truck className="w-7 h-7 text-blue-400" />
                  </div>

                  <div className="space-y-0.5">
                    <div className="text-lg font-black text-white tracking-tight">Express Priority</div>
                    <div className="text-[11px] text-blue-300 font-bold uppercase tracking-wider">Zero-Delay Fulfillment</div>
                  </div>

                  {/* Feature Checklist */}
                  <div className="space-y-2.5 pt-1 text-left">
                    <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/5 text-[11px] font-bold text-gray-200">
                      <div className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400">
                        <PackageCheck className="w-3.5 h-3.5" />
                      </div>
                      <span>Free Express Delivery on $99+</span>
                    </div>

                    <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/5 text-[11px] font-bold text-gray-200">
                      <div className="p-1 rounded-lg bg-blue-500/20 text-blue-400">
                        <ShieldCheck className="w-3.5 h-3.5" />
                      </div>
                      <span>Verified Secure Checkout Protocol</span>
                    </div>
                  </div>

                  {/* Bottom Interactive Tag */}
                  <div className="pt-1 text-[10px] font-black uppercase tracking-widest text-gray-500">
                    Active Worldwide • 24/7 Dispatch
                  </div>

                </div>

              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}