import React, { useState } from 'react';
import {
  uploadProductImages,
  deleteProductImage,
  reorderProductImages,
  updateImageMetadata,
} from '../../services/adminService';

const MAX_IMAGES = 8;
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export default function ProductImageManager({ productId, existingImages = [], onImagesUpdated }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  // Handle local file selection
  const handleFileChange = (e) => {
    setError('');
    const files = Array.from(e.target.files);

    if (existingImages.length + selectedFiles.length + files.length > MAX_IMAGES) {
      setError(`Maximum limit is ${MAX_IMAGES} images per product.`);
      return;
    }

    const validFiles = [];
    const newPreviews = [];

    files.forEach((file) => {
      if (!ALLOWED_TYPES.includes(file.type)) {
        setError('Only JPG, PNG, and WEBP formats are allowed.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Maximum image size is 5 MB.');
        return;
      }
      validFiles.push(file);
      newPreviews.push(URL.createObjectURL(file));
    });

    setSelectedFiles((prev) => [...prev, ...validFiles]);
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeSelectedFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Upload staged files
  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    setUploading(true);
    setProgress(0);
    setError('');

    try {
      const formData = new FormData();
      selectedFiles.forEach((file) => formData.append('images', file));

      const res = await uploadProductImages(productId, formData, (percent) => setProgress(percent));
      onImagesUpdated(res.images);
      setSelectedFiles([]);
      setPreviews([]);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  // Delete existing Cloudinary image
  const handleDeleteExisting = async (imageId) => {
    if (!window.confirm('Delete this image permanently from Cloudinary?')) return;
    try {
      const res = await deleteProductImage(productId, imageId);
      onImagesUpdated(res.images);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete image');
    }
  };

  // Move position
  const handleMove = async (index, direction) => {
    const newImages = [...existingImages];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newImages.length) return;

    const temp = newImages[index];
    newImages[index] = newImages[targetIndex];
    newImages[targetIndex] = temp;

    const imageOrder = newImages.map((img) => img._id);
    const primaryId = newImages.find((img) => img.isPrimary)?._id;

    try {
      const res = await reorderProductImages(productId, imageOrder, primaryId);
      onImagesUpdated(res.images);
    } catch (err) {
      setError('Failed to reorder images');
    }
  };

  // Set primary
  const handleSetPrimary = async (imageId) => {
    try {
      const res = await updateImageMetadata(productId, imageId, { isPrimary: true });
      onImagesUpdated(res.images);
    } catch (err) {
      setError('Failed to update primary image');
    }
  };

  return (
    <div style={{ padding: '16px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h3>Product Images ({existingImages.length} / {MAX_IMAGES})</h3>

      {error && <div style={{ color: 'red', marginBottom: '12px' }}>{error}</div>}

      {/* Existing Images Gallery */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
        {existingImages.map((img, index) => (
          <div key={img._id || index} style={{ border: '1px solid #ddd', padding: '8px', width: '140px' }}>
            <img src={img.url} alt={img.altText} style={{ width: '100%', height: '100px', objectFit: 'cover' }} />
            <div style={{ fontSize: '12px', margin: '4px 0' }}>
              {img.isPrimary ? <strong>Primary</strong> : <button type="button" onClick={() => handleSetPrimary(img._id)}>Set Primary</button>}
            </div>
            <div style={{ display: 'flex', gap: '4px', justifyContent: 'space-between' }}>
              <button type="button" disabled={index === 0} onClick={() => handleMove(index, -1)}>←</button>
              <button type="button" disabled={index === existingImages.length - 1} onClick={() => handleMove(index, 1)}>→</button>
              <button type="button" onClick={() => handleDeleteExisting(img._id)} style={{ color: 'red' }}>✕</button>
            </div>
          </div>
        ))}
      </div>

      {/* File Upload Section */}
      {existingImages.length < MAX_IMAGES && (
        <div>
          <input type="file" multiple accept="image/jpeg,image/png,image/webp" onChange={handleFileChange} disabled={uploading} />
          
          {previews.length > 0 && (
            <div style={{ marginTop: '12px' }}>
              <h4>Selected Previews</h4>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {previews.map((src, idx) => (
                  <div key={idx} style={{ position: 'relative' }}>
                    <img src={src} alt="Preview" style={{ width: '80px', height: '80px', objectFit: 'cover' }} />
                    <button
                      type="button"
                      onClick={() => removeSelectedFile(idx)}
                      style={{ position: 'absolute', top: 0, right: 0, background: 'red', color: 'white', border: 'none' }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              <button type="button" onClick={handleUpload} disabled={uploading} style={{ marginTop: '8px' }}>
                {uploading ? `Uploading (${progress}%)...` : 'Upload Images'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}