import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  Compass, 
  ShieldCheck, 
  Zap, 
  Star, 
  Flame, 
  Headphones, 
  Watch, 
  Shirt, 
  Smartphone,
  Radio
} from 'lucide-react';

export default function HeroSection({ heroProduct }) {
  const navigate = useNavigate();
  const cardRef = useRef(null);
  const heroContainerRef = useRef(null);

  // States for 3D card tilt
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Interactive Card Mouse Dynamics
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    
    setMousePos({ x: x * 15, y: y * 15 });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePos({ x: 0, y: 0 });
  };

  // Fallback product data if API is loading or using the controller image asset
  const displayProduct = heroProduct || {
    name: 'Nova Wireless Controller',
    price: 64.99,
    rating: 4.9,
    category: 'Gaming Gear',
    image: '/controller.jpg',
  };

  const handleProductClick = (e) => {
    e.preventDefault();
    window.scrollTo(0, 0);
    navigate('/products');
  };

  return (
    <section 
      ref={heroContainerRef}
      className="relative overflow-hidden bg-surface-50 pt-10 pb-14 lg:pt-14 lg:pb-20 border-b border-surface-200/80 select-none"
    >
      {/* Dynamic Keyframes for Product Orbit Animations */}
      <style>{`
        @keyframes radarSweep {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes orbitClockwise {
          0% { transform: rotate(0deg) translateX(170px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(170px) rotate(-360deg); }
        }
        @keyframes orbitCounterClockwise {
          0% { transform: rotate(360deg) translateX(220px) rotate(-360deg); }
          100% { transform: rotate(0deg) translateX(220px) rotate(0deg); }
        }
        @keyframes blipPulse {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.8); opacity: 0.9; }
        }

        .animate-radar-sweep { animation: radarSweep 10s linear infinite; }
        .animate-orbit-1 { animation: orbitClockwise 22s linear infinite; }
        .animate-orbit-2 { animation: orbitCounterClockwise 28s linear infinite; }
        .animate-blip { animation: blipPulse 3s ease-in-out infinite; }

        @media (prefers-reduced-motion: reduce) {
          .animate-radar-sweep, .animate-orbit-1, .animate-orbit-2, .animate-blip {
            animation: none !important;
          }
        }
      `}</style>

      {/* BACKGROUND DISCOVERY RADAR VISUALS */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        
        {/* Ambient Center Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50rem] h-[50rem] bg-brand-500/10 rounded-full blur-[120px]" />

        {/* Soft Background Sweeper Canvas */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[42rem] h-[42rem]">
          {/* Rotating Subtle Sweeper Beam */}
          <div className="absolute inset-0 rounded-full animate-radar-sweep origin-center opacity-60">
            <div 
              className="w-1/2 h-1/2 origin-bottom-right rounded-tl-full"
              style={{
                background: 'conic-gradient(from 180deg at 100% 100%, transparent 0deg, transparent 270deg, rgba(99, 102, 241, 0.12) 360deg)',
              }}
            />
          </div>

          {/* Animated Radar Discovery Blip Nodes */}
          <div className="absolute top-[22%] left-[28%] w-2.5 h-2.5 rounded-full bg-brand-500 animate-blip" />
          <div className="absolute bottom-[30%] right-[20%] w-3 h-3 rounded-full bg-tealAccent-500 animate-blip" style={{ animationDelay: '1.2s' }} />
          <div className="absolute top-[40%] right-[15%] w-2 h-2 rounded-full bg-brand-600 animate-blip" style={{ animationDelay: '2s' }} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Content Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-100/90 border border-brand-500/30 text-brand-600 text-xs font-black tracking-wider uppercase shadow-sm backdrop-blur-md">
              <Radio className="w-3.5 h-3.5 text-brand-500 animate-pulse" />
              <span>Discovery Orbit Active</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-surface-900 tracking-tight leading-[1.1]">
              Find something <br className="hidden sm:inline" />
              <span className="text-gradient">you'll actually love.</span>
            </h1>

            {/* Supporting Subtitle */}
            <p className="text-base sm:text-lg text-surface-800 font-medium max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Stop endlessly scrolling through thousands of repetitive listings. Our smart radar surfaces curated high-performance tech, apparel, and lifestyle products built for you.
            </p>

            {/* CTA Action Group */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-1">
              <Link
                to="/products"
                className="group px-8 py-4 rounded-full bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-sm shadow-xl shadow-brand-500/25 hover:shadow-brand-500/40 transition-all duration-300 active:scale-95 flex items-center gap-3"
              >
                <span>Explore Products</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>

              <a
                href="#categories"
                className="px-7 py-4 rounded-full bg-surface-100 hover:bg-surface-200/80 text-surface-900 border border-surface-200 font-bold text-sm transition-all duration-300 active:scale-95 flex items-center gap-2.5 shadow-sm"
              >
                <Compass className="w-4 h-4 text-tealAccent-500" />
                <span>Browse Categories</span>
              </a>
            </div>

            {/* Value Proposition Highlights */}
            <div className="pt-6 border-t border-surface-200/80 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0 text-left">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-brand-50 text-brand-500">
                  <Zap className="w-4 h-4 shrink-0" />
                </div>
                <span className="text-xs font-extrabold text-surface-900">Smart Search</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-brand-50 text-tealAccent-500">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                </div>
                <span className="text-xs font-extrabold text-surface-900">Verified Quality</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-brand-50 text-brand-600">
                  <Flame className="w-4 h-4 shrink-0" />
                </div>
                <span className="text-xs font-extrabold text-surface-900">Curated Drops</span>
              </div>
            </div>

          </div>

          {/* Right Hero Column: Product Orbit System */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <div className="relative w-full max-w-md h-[420px] flex items-center justify-center">
              
              {/* Floating Orbit Layer */}
              <div className="absolute inset-0 flex items-center justify-center">

                {/* Orbiting Category Node 1: Audio */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="animate-orbit-1 pointer-events-auto">
                    <div className="px-3.5 py-1.5 rounded-full bg-surface-100/95 border border-surface-200 shadow-md backdrop-blur-md flex items-center gap-2 text-[11px] font-black text-surface-900 hover:scale-110 transition-transform">
                      <Headphones className="w-3.5 h-3.5 text-brand-500" />
                      <span>Audio</span>
                    </div>
                  </div>
                </div>

                {/* Orbiting Category Node 2: Wearables */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="animate-orbit-1 pointer-events-auto" style={{ animationDelay: '-11s' }}>
                    <div className="px-3.5 py-1.5 rounded-full bg-surface-100/95 border border-surface-200 shadow-md backdrop-blur-md flex items-center gap-2 text-[11px] font-black text-surface-900 hover:scale-110 transition-transform">
                      <Watch className="w-3.5 h-3.5 text-tealAccent-500" />
                      <span>Tech</span>
                    </div>
                  </div>
                </div>

                {/* Orbiting Category Node 3: Apparel */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="animate-orbit-2 pointer-events-auto">
                    <div className="px-3.5 py-1.5 rounded-full bg-surface-100/95 border border-surface-200 shadow-md backdrop-blur-md flex items-center gap-2 text-[11px] font-black text-surface-900 hover:scale-110 transition-transform">
                      <Shirt className="w-3.5 h-3.5 text-brand-600" />
                      <span>Apparel</span>
                    </div>
                  </div>
                </div>

                {/* Orbiting Category Node 4: Mobile */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="animate-orbit-2 pointer-events-auto" style={{ animationDelay: '-14s' }}>
                    <div className="px-3.5 py-1.5 rounded-full bg-surface-100/95 border border-surface-200 shadow-md backdrop-blur-md flex items-center gap-2 text-[11px] font-black text-surface-900 hover:scale-110 transition-transform">
                      <Smartphone className="w-3.5 h-3.5 text-amber-500" />
                      <span>Gadgets</span>
                    </div>
                  </div>
                </div>

                {/* Floating Rating Pill Left */}
                <div className="absolute -top-1 left-2 z-30 bg-surface-100/95 backdrop-blur-md border border-surface-200 px-3.5 py-2 rounded-2xl shadow-lg flex items-center gap-2.5">
                  <div className="p-1.5 rounded-xl bg-amber-500/10 text-amber-500">
                    <Star className="w-4 h-4 fill-amber-500" />
                  </div>
                  <div>
                    <div className="text-[11px] font-black text-surface-900">{displayProduct.rating} Rating</div>
                    <div className="text-[9px] font-bold text-surface-800/60">Featured Pick</div>
                  </div>
                </div>

                {/* CENTERED PRODUCT CARD */}
                <div 
                  ref={cardRef}
                  onClick={handleProductClick}
                  onMouseMove={handleMouseMove}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={handleMouseLeave}
                  style={{
                    transform: isHovered 
                      ? `rotateY(${mousePos.x}deg) rotateX(${-mousePos.y}deg) translateY(-4px)` 
                      : 'rotateY(0deg) rotateX(0deg) translateY(0px)',
                    transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out',
                  }}
                  className="relative w-72 rounded-3xl bg-surface-100/95 border border-surface-200 p-4 shadow-2xl z-20 group backdrop-blur-sm cursor-pointer"
                >
                  {/* Subtle Glow Backdrop */}
                  <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-brand-500/15 rounded-full blur-2xl group-hover:bg-brand-500/25 transition-all duration-500" />

                  {/* Image Container */}
                  <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-surface-50 mb-3.5 border border-surface-200/50">
                    <img
                      src="/controller.jpg"
                      alt={displayProduct.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-surface-900/80 text-white text-[9px] font-black uppercase tracking-wider backdrop-blur-md">
                      {displayProduct.category || 'Featured Drop'}
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-black text-surface-900 line-clamp-1 group-hover:text-brand-500 transition-colors">
                      {displayProduct.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-black text-surface-900">
                        ${Number(displayProduct.price || 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Floating Stock Pill Bottom Right */}
                <div className="absolute -bottom-1 right-2 z-30 bg-surface-100/95 backdrop-blur-md border border-surface-200 px-3.5 py-2 rounded-2xl shadow-lg flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-tealAccent-500 animate-ping" />
                  <span className="text-xs font-extrabold text-surface-900">In Orbit</span>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}