import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Gamepad2, 
  Headphones, 
  Smartphone, 
  Laptop, 
  Watch, 
  Shirt, 
  Zap,
  Keyboard,
  Camera,
  Tv,
  Cpu,
  ArrowRight,
  Package,
  LayoutGrid,
  Sparkles,
  BookOpen,
  Home,
  Dumbbell,
  Palette,
  HeartPulse,
  Coffee,
  ShoppingBag,
  Car,
  Baby
} from 'lucide-react';
import categoryService from '../../services/categoryService';

// Comprehensive icon pool to guarantee unique icons for diverse categories
const CATEGORY_ICONS = [
  Sparkles,
  BookOpen,
  Home,
  Dumbbell,
  Palette,
  HeartPulse,
  Coffee,
  ShoppingBag,
  Car,
  Baby,
  Gamepad2,
  Headphones,
  Smartphone,
  Laptop,
  Watch,
  Shirt,
  Zap,
  Keyboard,
  Camera,
  Tv,
  Cpu
];

// Smart icon mapping with index fallback to ensure absolute uniqueness and match categories precisely
const getCategoryIcon = (categoryName = '', index = 0) => {
  const name = categoryName.toLowerCase();
  
  if (name.includes('accessory') || name.includes('accessories')) return ShoppingBag;
  if (name.includes('beauty') || name.includes('personal') || name.includes('care') || name.includes('cosmetic')) return Sparkles;
  if (name.includes('book') || name.includes('stationery') || name.includes('office') || name.includes('pen')) return BookOpen;
  if (name.includes('home') || name.includes('living') || name.includes('furniture') || name.includes('decor')) return Home;
  if (name.includes('sport') || name.includes('fitness') || name.includes('gym') || name.includes('active')) return Dumbbell;
  if (name.includes('keyboard') || name.includes('keycap') || name.includes('typing')) return Keyboard;
  if (name.includes('electron') || name.includes('gadget') || name.includes('tech')) return Zap;
  if (name.includes('game') || name.includes('gaming') || name.includes('console')) return Gamepad2;
  if (name.includes('audio') || name.includes('headphone') || name.includes('speaker') || name.includes('sound')) return Headphones;
  if (name.includes('phone') || name.includes('mobile') || name.includes('tablet')) return Smartphone;
  if (name.includes('computer') || name.includes('laptop') || name.includes('pc')) return Laptop;
  if (name.includes('watch') || name.includes('wearable') || name.includes('smartwatch')) return Watch;
  if (name.includes('apparel') || name.includes('clothing') || name.includes('wear') || name.includes('fashion')) return Shirt;
  if (name.includes('camera') || name.includes('photo') || name.includes('lens')) return Camera;
  if (name.includes('display') || name.includes('monitor') || name.includes('tv')) return Tv;
  if (name.includes('component') || name.includes('chip') || name.includes('processor')) return Cpu;

  // Fallback to a distinct icon from the pool based on index to avoid duplicates like generic Package
  return CATEGORY_ICONS[index % CATEGORY_ICONS.length];
};

export default function CategorySection() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const data = await categoryService.getCategories();
        if (isMounted) {
          let categoryList = Array.isArray(data) ? data : data?.categories || [];
          setCategories(categoryList);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Failed to load categories:', err);
          setError('Unable to load categories right now.');
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchCategories();
    return () => { isMounted = false; };
  }, []);

  return (
    <section id="categories" className="py-16 bg-gradient-to-b from-slate-50/50 via-white to-slate-50/50 border-b border-slate-200/60 relative overflow-hidden">
      
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-10 left-1/4 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Compact & Refined Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 pb-4 border-b border-slate-100">
          <div className="space-y-1.5">
            {/* Pill with LayoutGrid Icon */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-700 font-extrabold text-[10px] uppercase tracking-wider shadow-2xs">
              <LayoutGrid className="w-3 h-3 text-cyan-600" />
              Curated Collections
            </div>
            
            {/* Smaller, Sized-Down Header Title */}
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Explore by <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600">what you're into</span>
            </h2>
          </div>

          {/* Theme-Matched "View All Categories" Button */}
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 hover:from-cyan-500 hover:to-blue-600 border border-cyan-500/20 hover:border-transparent text-cyan-700 hover:text-white text-xs font-black transition-all duration-300 group shadow-2xs hover:shadow-md hover:shadow-cyan-500/20 w-fit"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-3.5 h-3.5 text-cyan-600 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
          </Link>
        </div>

        {/* Loading State - Skeletons */}
        {isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="h-44 rounded-3xl bg-white border border-slate-200/80 p-5 animate-pulse flex flex-col justify-between shadow-xs"
              >
                <div className="w-12 h-12 rounded-2xl bg-slate-100" />
                <div className="space-y-2">
                  <div className="h-4 w-3/4 rounded bg-slate-200" />
                  <div className="h-3 w-1/2 rounded bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="p-6 rounded-3xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold text-center shadow-xs">
            {error}
          </div>
        )}

        {/* Category Cards Grid */}
        {!isLoading && !error && categories.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
            {categories.map((cat, index) => {
              const CategoryIcon = getCategoryIcon(cat.name || cat.slug, index);
              const categoryParam = cat._id || cat.slug || cat.name;

              return (
                <Link
                  key={cat._id || cat.id || cat.slug || index}
                  to={`/products?category=${encodeURIComponent(categoryParam)}`}
                  style={{ animationDelay: `${index * 70}ms` }}
                  className="group relative rounded-3xl bg-white border border-slate-200/80 hover:border-cyan-500/50 p-5 flex flex-col justify-between shadow-xs hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 hover:-translate-y-1.5 overflow-hidden animate-fadeIn"
                >
                  {/* Hover Accent Glow */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute -right-8 -top-8 w-24 h-24 bg-cyan-500/5 rounded-full group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

                  {/* Icon Box */}
                  <div className="p-3 rounded-2xl bg-slate-100/80 border border-slate-200/60 text-slate-800 group-hover:bg-gradient-to-br group-hover:from-cyan-500 group-hover:to-blue-600 group-hover:text-white group-hover:border-transparent transition-all duration-300 w-fit shadow-2xs">
                    <CategoryIcon className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                  </div>

                  {/* High Contrast Category Title & Visible Subtext */}
                  <div className="mt-8 relative z-10">
                    <h3 className="text-sm font-black text-slate-900 group-hover:text-cyan-600 transition-colors line-clamp-1">
                      {cat.name}
                    </h3>
                    
                    <div className="flex items-center justify-between mt-1 text-xs font-bold text-slate-500 group-hover:text-slate-700 transition-colors">
                      <span>
                        {cat.productCount !== undefined ? `${cat.productCount} Products` : 'Explore'}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-cyan-600 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && categories.length === 0 && (
          <div className="py-16 text-center bg-white rounded-3xl border border-slate-200/80 shadow-xs">
            <p className="text-slate-600 font-extrabold text-sm">
              No categories available at the moment.
            </p>
          </div>
        )}

      </div>
    </section>
  );
}