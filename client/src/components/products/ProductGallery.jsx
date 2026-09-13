import React, { useState } from 'react';
import { getOptimizedImageUrl } from '../utils/cloudinary';

export default function ProductGallery({ images = [], productName = 'Product' }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Fallback if product has no images
  const galleryImages = images.length > 0 
    ? images 
    : [{ url: '/placeholder-product.png', altText: productName }];

  const activeImage = galleryImages[selectedIndex] || galleryImages[0];

  return (
    <div style={{ width: '100%', maxWidth: '600px' }}>
      {/* Main Image Display */}
      <div 
        style={{ 
          border: '1px solid #e5e7eb', 
          borderRadius: '8px', 
          overflow: 'hidden', 
          cursor: 'zoom-in',
          marginBottom: '12px',
          backgroundColor: '#f9fafb'
        }}
        onClick={() => setIsLightboxOpen(true)}
      >
        <img
          src={getOptimizedImageUrl(activeImage.url, { width: 800 })}
          alt={activeImage.altText || productName}
          style={{ width: '100%', height: '400px', objectFit: 'contain', display: 'block' }}
        />
      </div>

      {/* Thumbnails Gallery */}
      {galleryImages.length > 1 && (
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {galleryImages.map((img, idx) => (
            <button
              key={img._id || idx}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              style={{
                border: selectedIndex === idx ? '2px solid #2563eb' : '1px solid #d1d5db',
                borderRadius: '6px',
                padding: '2px',
                background: 'white',
                cursor: 'pointer',
                opacity: selectedIndex === idx ? 1 : 0.7,
                outline: 'none',
              }}
            >
              <img
                src={getOptimizedImageUrl(img.url, { width: 150 })}
                alt={img.altText || `${productName} thumbnail ${idx + 1}`}
                style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '4px' }}
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
          onClick={() => setIsLightboxOpen(false)}
        >
          <div 
            style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              style={{
                position: 'absolute',
                top: '-40px',
                right: '0',
                color: 'white',
                background: 'transparent',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer'
              }}
            >
              ✕ Close
            </button>
            <img
              src={getOptimizedImageUrl(activeImage.url, { width: 1200 })}
              alt={activeImage.altText || productName}
              style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain' }}
            />
          </div>
        </div>
      )}
    </div>
  );
}