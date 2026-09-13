import React from 'react';
import ProductCard from './ProductCard';

export default function ProductGrid({
  products = [],
  isLoading = false,
  onAddToCart,
  wishlistedIds = [],
  onToggleWishlist,
  skeletonCount = 8,
}) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: skeletonCount }).map((_, idx) => (
          <div
            key={idx}
            className="rounded-2xl bg-surface-100 border border-surface-200 p-4 animate-pulse flex flex-col gap-3"
          >
            <div className="aspect-square w-full rounded-xl bg-surface-200/80" />
            <div className="h-4 w-3/4 rounded bg-surface-200/80 mt-1" />
            <div className="h-3 w-1/2 rounded bg-surface-200/60" />
            <div className="flex items-center justify-between pt-3 border-t border-surface-200/50 mt-2">
              <div className="h-5 w-16 rounded bg-surface-200/80" />
              <div className="h-9 w-9 rounded-xl bg-surface-200/80" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product._id || product.id}
          product={product}
          onAddToCart={onAddToCart}
          isWishlisted={wishlistedIds.includes(product._id || product.id)}
          onToggleWishlist={onToggleWishlist}
        />
      ))}
    </div>
  );
}