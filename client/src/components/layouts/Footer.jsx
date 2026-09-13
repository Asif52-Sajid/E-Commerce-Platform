import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, Truck, RotateCcw, ArrowUp } from 'lucide-react';
import Logo from '../../common/Logo';
import FooterCard from '../../common/FooterCard';
import NewsletterForm from '../../common/NewsletterForm';
import SocialLinks from '../../common/SocialLinks';

export default function Footer() {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryClick = (e) => {
    e.preventDefault();
    if (location.pathname === '/') {
      const element = document.getElementById('categories-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('/?scrollTo=categories-section');
    }
  };

  return (
    <footer className="relative bg-white border-t border-slate-200/80 mt-auto text-slate-800 select-none">
      {/* Top Accent Bar */}
      <div className="h-1 w-full bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600" />

      {/* Interactive Value Propositions */}
      <div className="border-b border-slate-200/80 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <FooterCard 
            icon={Truck} 
            title="Fast Express Shipping" 
            description="Tracked global delivery directly to your doorstep" 
          />
          <FooterCard 
            icon={ShieldCheck} 
            title="Secure Checkout" 
            description="256-bit SSL encrypted & risk-free transactions" 
          />
          <FooterCard 
            icon={RotateCcw} 
            title="30-Day Guarantee" 
            description="Hassle-free returns & instant refund policy" 
          />
        </div>
      </div>

      {/* Main Footer Link Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand Info & Imported Social Links */}
          <div className="space-y-4">
            <Logo size="md" showTagline={true} />
            <p className="text-xs text-slate-600 leading-relaxed font-semibold">
              Curating high-performance technology, modern fashion, and premium lifestyle goods built for the modern standard.
            </p>

            {/* Live System Operational Status Badge */}
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-700 text-[11px] font-black">
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
              <span>All Systems Operational</span>
            </div>

            {/* Social Links imported from common */}
            <SocialLinks />
          </div>

          {/* Navigation Links Column */}
          <div>
            <h3 className="text-xs font-black text-slate-900 tracking-widest uppercase mb-4">Explore</h3>
            <ul className="space-y-2.5 text-xs font-bold">
              <li><Link to="/products" className="text-slate-600 hover:text-cyan-600 transition-colors">Catalog Overview</Link></li>
              <li><Link to="/products?featured=true" className="text-slate-600 hover:text-cyan-600 transition-colors">Featured Collection</Link></li>
              <li><a href="/#categories-section" onClick={handleCategoryClick} className="text-slate-600 hover:text-cyan-600 transition-colors cursor-pointer">Categories</a></li>
            </ul>
          </div>

          {/* Support Links Column - Updated with FAQ */}
          <div>
            <h3 className="text-xs font-black text-slate-900 tracking-widest uppercase mb-4">Support</h3>
            <ul className="space-y-2.5 text-xs font-bold">
              <li><Link to="/help-desk" className="text-slate-600 hover:text-cyan-600 transition-colors">Customer Help Desk</Link></li>
              <li><Link to="/faq" className="text-slate-600 hover:text-cyan-600 transition-colors">FAQs</Link></li>
              <li><Link to="/privacy-terms" className="text-slate-600 hover:text-cyan-600 transition-colors">Privacy Terms</Link></li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h3 className="text-xs font-black text-slate-900 tracking-widest uppercase mb-4">Newsletter</h3>
            <p className="text-xs text-slate-600 mb-3 font-semibold">Get early drop notifications and exclusive discounts.</p>
            <NewsletterForm />
          </div>

        </div>

        {/* Bottom Bar: Aligned Copyright & Back To Top with Compact Bottom Spacing */}
        <div className="border-t border-slate-200 mt-8 pt-4 flex items-center justify-between text-xs font-bold text-slate-600">
          
          {/* Centered Copyright aligned horizontally */}
          <div className="flex-1 text-center">
            © {new Date().getFullYear()} ShopNex Platform. Designed with precision.
          </div>

          {/* Back To Top Button aligned on the right */}
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 p-2 rounded-xl bg-slate-100 hover:bg-slate-900 text-slate-700 hover:text-white transition-all border border-slate-200 shrink-0 cursor-pointer shadow-xs"
            aria-label="Scroll to top"
          >
            <span className="hidden sm:inline">Back to top</span>
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}