import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import adminService from '../../services/adminService';

export default function AdminProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    isActive: true,
    featured: false,
    tags: '',
  });

  // Image Upload States
  const [existingImages, setExistingImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    adminService.getCategories().then((res) => setCategories(res.data || [])).catch(() => {});

    if (isEdit) {
      setLoading(true);
      adminService.getAdminProductById(id)
        .then((res) => {
          const prod = res.data || res;
          setFormData({
            name: prod.name || '',
            description: prod.description || '',
            price: prod.price || '',
            category: prod.category?._id || prod.category || '',
            stock: prod.stock || 0,
            isActive: Boolean(prod.isActive ?? true),
            featured: Boolean(prod.featured ?? false),
            tags: Array.isArray(prod.tags) ? prod.tags.join(', ') : prod.tags || '',
          });
          setExistingImages(prod.images || []);
        })
        .catch((err) => setError(err.response?.data?.message || 'Failed to load product'))
        .finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const totalCurrentCount = existingImages.length + selectedFiles.length;

    if (totalCurrentCount + files.length > 8) {
      setError('Maximum limit of 8 images per product exceeded.');
      return;
    }

    const validFiles = files.filter((file) => {
      const isValidType = ['image/jpeg', 'image/png', 'image/webp'].includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024;
      return isValidType && isValidSize;
    });

    if (validFiles.length < files.length) {
      setError('Some files were skipped. Only .jpg, .png, .webp under 5MB are allowed.');
    } else {
      setError(null);
    }

    setSelectedFiles((prev) => [...prev, ...validFiles]);
    const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
    setFilePreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeStagedFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setFilePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (imageId) => {
    setExistingImages((prev) => prev.filter((img) => img._id !== imageId));
    setImagesToDelete((prev) => [...prev, imageId]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.name || !formData.price || !formData.stock || !formData.category) {
      setError('Please fill in all required fields.');
      return;
    }

    // Explicitly sanitize and lowercase tags into an array
    const formattedTags = typeof formData.tags === 'string'
      ? formData.tags.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean)
      : Array.isArray(formData.tags)
      ? formData.tags.map((t) => String(t).trim().toLowerCase())
      : [];

    const payload = {
      ...formData,
      tags: formattedTags,
      featured: Boolean(formData.featured),
      isActive: Boolean(formData.isActive),
    };

    try {
      setLoading(true);

      let targetProductId = id;

      if (isEdit) {
        await adminService.updateProduct(id, payload);

        if (imagesToDelete.length > 0) {
          for (const imgId of imagesToDelete) {
            await adminService.deleteProductImage(id, imgId);
          }
        }
      } else {
        const createRes = await adminService.createProduct(payload);
        targetProductId = createRes.data?._id || createRes._id || createRes.id;
      }

      if (selectedFiles.length > 0 && targetProductId) {
        const imageFormData = new FormData();
        selectedFiles.forEach((file) => {
          imageFormData.append('images', file);
        });

        try {
          await adminService.uploadProductImages(targetProductId, imageFormData);
        } catch (imgErr) {
          console.error('Image upload failed:', imgErr);
          setError(imgErr.response?.data?.message || 'Product created, but failed to upload images.');
          setLoading(false);
          return;
        }
      }

      navigate('/admin/products');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEdit) {
    return (
      <div className="p-8 text-center text-slate-400 font-mono text-xs">
        Loading product details...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="border-b border-cyan-500/20 pb-4">
        <h1 className="text-xl font-mono font-black uppercase tracking-wider bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-white bg-clip-text text-transparent">
          {isEdit ? 'Edit Product' : 'Add New Product'}
        </h1>
        <p className="text-slate-400 font-mono text-xs mt-1">
          &gt; Configure product pricing, details, images, and stock
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-3 bg-rose-950/40 border border-rose-500/40 rounded-lg text-rose-300 font-mono text-xs flex items-center space-x-2">
          <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
          <span>[ERROR]: {error}</span>
        </div>
      )}

      {/* Form Container */}
      <div className="relative bg-[#080813] border border-cyan-500/20 p-6 rounded-xl shadow-[0_0_15px_rgba(34,211,238,0.05)]">
        <div className="absolute -top-px -right-px w-8 h-8 bg-gradient-to-bl from-cyan-500/30 to-transparent rounded-tr-xl pointer-events-none" />

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Product Name */}
          <div>
            <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1 tracking-wider">
              Product Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-[#030308] border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all placeholder:text-slate-600"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1 tracking-wider">
              Category <span className="text-rose-400">*</span>
            </label>
            <select
              name="category"
              required
              value={formData.category}
              onChange={handleChange}
              className="w-full bg-[#030308] border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
            >
              <option value="" className="bg-[#030308] text-slate-500">
                Select Category
              </option>
              {categories.map((c) => (
                <option key={c._id} value={c._id} className="bg-[#030308] text-slate-200">
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Price & Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1 tracking-wider">
                Price (৳) <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                name="price"
                min="0"
                step="0.01"
                required
                value={formData.price}
                onChange={handleChange}
                className="w-full bg-[#030308] border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1 tracking-wider">
                Stock Quantity <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                name="stock"
                min="0"
                required
                value={formData.stock}
                onChange={handleChange}
                className="w-full bg-[#030308] border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
              />
            </div>
          </div>

          {/* Product Tags Input */}
          <div>
            <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1 tracking-wider">
              Product Tags <span className="text-slate-500">(Comma separated e.g. gaming, minimalist, workstation)</span>
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="gaming, minimalist, workstation"
              className="w-full bg-[#030308] border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all placeholder:text-slate-600"
            />
          </div>

          {/* Product Images Selector */}
          <div>
            <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1 tracking-wider">
              Product Images <span className="text-slate-500">(Max 8 images, JPG/PNG/WEBP)</span>
            </label>
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileSelect}
              className="block w-full text-xs font-mono text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border file:border-cyan-500/30 file:bg-[#030308] file:text-cyan-300 file:font-mono file:text-xs hover:file:bg-cyan-500/10 transition-all cursor-pointer"
            />

            {(existingImages.length > 0 || filePreviews.length > 0) && (
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 mt-3 p-3 bg-[#030308] border border-slate-800 rounded-lg">
                {existingImages.map((img) => (
                  <div key={img._id} className="relative group rounded-md overflow-hidden border border-cyan-500/30 aspect-square">
                    <img src={img.url} alt={img.altText || 'Product'} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(img._id)}
                      className="absolute top-1 right-1 bg-rose-600/90 text-white rounded-full p-1 text-[10px] leading-none opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ✕
                    </button>
                    <span className="absolute bottom-1 left-1 bg-cyan-950/80 text-cyan-300 text-[8px] font-mono px-1 rounded">
                      Saved
                    </span>
                  </div>
                ))}

                {filePreviews.map((preview, idx) => (
                  <div key={idx} className="relative group rounded-md overflow-hidden border border-fuchsia-500/30 aspect-square">
                    <img src={preview} alt="Staged preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeStagedFile(idx)}
                      className="absolute top-1 right-1 bg-rose-600/90 text-white rounded-full p-1 text-[10px] leading-none opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ✕
                    </button>
                    <span className="absolute bottom-1 left-1 bg-fuchsia-950/80 text-fuchsia-300 text-[8px] font-mono px-1 rounded">
                      Staged
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1 tracking-wider">
              Description
            </label>
            <textarea
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              className="w-full bg-[#030308] border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all resize-none"
            />
          </div>

          {/* Checkboxes: Active & Featured */}
          <div className="flex flex-wrap gap-6 pt-2">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="h-4 w-4 accent-cyan-500 bg-[#030308] border-slate-800 rounded cursor-pointer"
              />
              <label htmlFor="isActive" className="text-xs font-mono text-slate-300 cursor-pointer select-none">
                Active in Customer Store
              </label>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="h-4 w-4 accent-fuchsia-500 bg-[#030308] border-slate-800 rounded cursor-pointer"
              />
              <label htmlFor="featured" className="text-xs font-mono text-slate-300 cursor-pointer select-none">
                Mark as Featured Product (Shows in 🔥 Trending Now)
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800/80">
            <button
              type="button"
              onClick={() => navigate('/admin/products')}
              className="px-4 py-2 bg-[#030308] border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 rounded-lg text-xs font-mono font-bold transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="relative group overflow-hidden rounded-lg p-[1px] font-mono text-xs font-bold transition-transform active:scale-95 disabled:opacity-50"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-fuchsia-600 transition-all duration-300 opacity-80 group-hover:opacity-100" />
              <span className="relative flex items-center justify-center rounded-[7px] bg-[#030308] px-5 py-2 transition-all duration-200 group-hover:bg-transparent text-white">
                {loading ? 'Processing...' : isEdit ? 'Update Product' : 'Create Product'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}