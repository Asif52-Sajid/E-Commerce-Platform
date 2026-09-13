import React, { useEffect, useState } from 'react';
import adminService from '../../services/adminService';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [submitting, setSubmitting] = useState(false);

  // State for delete confirmation popup
  const [deletingCategory, setDeletingCategory] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await adminService.getAdminCategories();
      setCategories(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleEditClick = (category) => {
    setEditingId(category._id);
    setFormData({
      name: category.name,
      description: category.description || '',
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ name: '', description: '' });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError('Category name is required');
      return;
    }

    try {
      setSubmitting(true);
      if (editingId) {
        await adminService.updateCategory(editingId, formData);
      } else {
        await adminService.createCategory(formData);
      }
      handleCancel();
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const triggerDeleteConfirm = (category) => {
    setDeletingCategory(category);
  };

  const confirmDelete = async () => {
    if (!deletingCategory) return;
    try {
      setDeleting(true);
      await adminService.deleteCategory(deletingCategory._id);
      setDeletingCategory(null);
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
      setDeletingCategory(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* Header */}
      <div className="border-b border-cyan-500/20 pb-4">
        <h1 className="text-xl font-mono font-black uppercase tracking-wider bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-white bg-clip-text text-transparent">
          Category Management
        </h1>
        <p className="text-slate-400 font-mono text-xs mt-1">
          &gt; Organize store items into core categories
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-3 bg-rose-950/40 border border-rose-500/40 rounded-lg text-rose-300 font-mono text-xs flex items-center space-x-2">
          <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
          <span>[ERROR]: {error}</span>
        </div>
      )}

      {/* Styled Neon Popup Box (Without Full-Screen Dark Background) */}
      {deletingCategory && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md p-4">
          <div className="relative bg-[#080813] border-2 border-rose-500/80 rounded-xl p-5 shadow-[0_0_30px_rgba(244,63,94,0.35)] space-y-4">
            <div className="flex items-center space-x-2 text-rose-400 font-mono text-xs uppercase tracking-wider font-bold">
              <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
              <span>[SYSTEM WARNING]: Confirm Deletion</span>
            </div>

            <p className="text-xs font-mono text-slate-300 leading-relaxed">
              Are you sure you want to delete category{' '}
              <span className="text-cyan-300 font-bold">"{deletingCategory.name}"</span>? 
              This action cannot be undone.
            </p>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingCategory(null)}
                disabled={deleting}
                className="px-3 py-1.5 bg-[#030308] border border-slate-800 text-slate-400 hover:text-white rounded-lg text-xs font-mono font-bold transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleting}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-mono font-bold transition-all shadow-[0_0_12px_rgba(244,63,94,0.4)] disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete Category'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cyberpunk Form Panel */}
        <div className="relative bg-[#080813] border border-cyan-500/20 p-5 rounded-xl h-fit shadow-[0_0_15px_rgba(34,211,238,0.05)]">
          {/* Subtle Corner Accent */}
          <div className="absolute -top-px -right-px w-8 h-8 bg-gradient-to-bl from-cyan-500/30 to-transparent rounded-tr-xl pointer-events-none" />

          <div className="flex items-center justify-between mb-4 border-b border-slate-800/80 pb-2">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center space-x-1.5">
              <span className="text-fuchsia-400">#</span>
              <span>{editingId ? 'Edit Category' : 'New Category'}</span>
            </h2>
            <span className="text-[10px] font-mono text-slate-500 uppercase">
              {editingId ? '[MOD MODE]' : '[CREATE MODE]'}
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1 tracking-wider">
                Category Name <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#030308] border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all placeholder:text-slate-600"
                  placeholder="e.g., Electronics"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1 tracking-wider">
                Description
              </label>
              <textarea
                rows="3"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-[#030308] border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all placeholder:text-slate-600 resize-none"
                placeholder="Optional description..."
              />
            </div>

            {/* Neon Form Actions */}
            <div className="flex space-x-2 pt-1">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 relative group overflow-hidden rounded-lg p-[1px] font-mono text-xs font-bold transition-transform active:scale-95 disabled:opacity-50"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-fuchsia-600 transition-all duration-300 opacity-80 group-hover:opacity-100" />
                <span className="relative flex items-center justify-center rounded-[7px] bg-[#030308] px-3 py-2 transition-all duration-200 group-hover:bg-transparent text-white">
                  {submitting ? 'Saving...' : editingId ? 'Update' : 'Create'}
                </span>
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-3 py-2 bg-[#030308] border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 rounded-lg text-xs font-mono font-bold transition-all"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Categories List */}
        <div className="lg:col-span-2 bg-[#080813] border border-cyan-500/20 rounded-xl overflow-hidden shadow-[0_0_15px_rgba(34,211,238,0.05)]">
          {loading ? (
            <div className="p-8 text-center text-slate-400 font-mono text-xs">
              Loading categories...
            </div>
          ) : categories.length === 0 ? (
            <div className="p-8 text-center text-slate-500 font-mono text-xs">
              No categories found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono text-slate-300">
                <thead className="bg-[#030308] text-slate-400 uppercase text-[11px] border-b border-cyan-500/20">
                  <tr>
                    <th className="p-3">Name / Slug</th>
                    <th className="p-3">Products</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {categories.map((cat) => (
                    <tr key={cat._id} className="hover:bg-[#0c0c1e] transition-colors">
                      <td className="p-3">
                        <div className="font-semibold text-slate-100">{cat.name}</div>
                        <div className="text-[10px] text-cyan-400/70">{cat.slug}</div>
                      </td>
                      <td className="p-3">
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-[#030308] text-cyan-300 rounded-md border border-cyan-500/30">
                          {cat.productCount} product(s)
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-1.5">
                        <button
                          onClick={() => handleEditClick(cat)}
                          className="text-[11px] bg-[#030308] hover:bg-cyan-500/20 text-cyan-300 hover:text-cyan-200 border border-cyan-500/30 px-2.5 py-1 rounded font-semibold transition-all"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => triggerDeleteConfirm(cat)}
                          className="text-[11px] bg-rose-950/30 hover:bg-rose-900/50 text-rose-400 border border-rose-500/30 px-2.5 py-1 rounded font-semibold transition-all"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}