import React from 'react';
import HeroSection from '../components/home/HeroSection';
import CategorySection from '../components/home/CategorySection';
import FeaturedProductsSection from '../components/home/FeaturedProductsSection';
import DiscoverySection from '../components/home/DiscoverySection';
import SmartShoppingSection from '../components/home/SmartShoppingSection';
import TrendingProductsSection from '../components/home/TrendingProductsSection';
import PromotionalSection from '../components/home/PromotionalSection';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-surface-50">
      {/* 1. Dynamic Hero Banner */}
      <HeroSection />

      {/* 2. Visual Category Discovery Grid */}
      <CategorySection />

      {/* 3. Curated Featured Products Showcase */}
      <FeaturedProductsSection />

      {/* 4. Interactive Taste/Vibe Matcher */}
      <DiscoverySection />

      {/* 5. Smart Shopping Value Propositions */}
      <SmartShoppingSection />

      {/* 6. Popular Trending Products */}
      <TrendingProductsSection />

      {/* 7. Promotional Deal Banner */}
      <PromotionalSection />
    </main>
  );
}