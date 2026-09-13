import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import adminService from '../../services/adminService';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  // Confirmation state for toggling status and deleting completely
  const [togglingProduct, setTogglingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await adminService.getAdminProducts({
        page,
        limit: 8,
        search,
        category: selectedCategory,
        status: selectedStatus,
      });
      setProducts(res.data);
      setPagination(res.pagination);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    adminService.getCategories().then((res) => setCategories(res.data || [])).catch(() => {});
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [page, selectedCategory, selectedStatus]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const confirmToggleStatus = async () => {
    if (!togglingProduct) return;
    try {
      setActionLoading(true);
      await adminService.toggleProductStatus(togglingProduct._id);
      setTogglingProduct(null);
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Action failed');
      setTogglingProduct(null);
    } finally {
      setActionLoading(false);
    }
  };

  const confirmDeleteProduct = async () => {
    if (!deletingProduct) return;
    try {
      setActionLoading(true);
      await adminService.deleteProduct(deletingProduct._id);
      setDeletingProduct(null);
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete product');
      setDeletingProduct(null);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cyan-500/20 pb-4">
        <div>
          <h1 className="text-xl font-mono font-black uppercase tracking-wider bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-white bg-clip-text text-transparent">
            Products
          </h1>
          <p className="text-slate-400 font-mono text-xs mt-1">
            &gt; Manage store inventory and product details
          </p>
        </div>
        <Link
          to="/admin/products/new"
          className="relative group overflow-hidden rounded-lg p-[1px] font-mono text-xs font-bold transition-transform active:scale-95"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-fuchsia-600 transition-all duration-300 opacity-80 group-hover:opacity-100" />
          <span className="relative flex items-center justify-center rounded-[7px] bg-[#030308] px-4 py-2 transition-all duration-200 group-hover:bg-transparent text-white">
            + Add Product
          </span>
        </Link>
      </div>

      {/* Status Toggle Modal */}
      {togglingProduct && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md p-4">
          <div className="relative bg-[#080813] border-2 border-fuchsia-500/80 rounded-xl p-5 shadow-[0_0_30px_rgba(217,70,239,0.35)] space-y-4">
            <div className="flex items-center space-x-2 text-fuchsia-400 font-mono text-xs uppercase tracking-wider font-bold">
              <span className="h-2 w-2 rounded-full bg-fuchsia-500 animate-ping" />
              <span>[SYSTEM WARNING]: Confirm Status Change</span>
            </div>

            <p className="text-xs font-mono text-slate-300 leading-relaxed">
              Are you sure you want to {togglingProduct.isActive ? 'deactivate' : 'activate'} product{' '}
              <span className="text-cyan-300 font-bold">"{togglingProduct.name}"</span>?
            </p>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setTogglingProduct(null)}
                disabled={actionLoading}
                className="px-3 py-1.5 bg-[#030308] border border-slate-800 text-slate-400 hover:text-white rounded-lg text-xs font-mono font-bold transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmToggleStatus}
                disabled={actionLoading}
                className="px-3 py-1.5 bg-fuchsia-600 hover:bg-fuchsia-500 text-white rounded-lg text-xs font-mono font-bold transition-all shadow-[0_0_12px_rgba(217,70,239,0.4)] disabled:opacity-50"
              >
                {actionLoading ? 'Updating...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Permanent Delete Confirmation Modal */}
      {deletingProduct && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md p-4">
          <div className="relative bg-[#080813] border-2 border-rose-500/80 rounded-xl p-5 shadow-[0_0_30px_rgba(244,63,94,0.35)] space-y-4">
            <div className="flex items-center space-x-2 text-rose-400 font-mono text-xs uppercase tracking-wider font-bold">
              <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
              <span>[SYSTEM WARNING]: Permanent Deletion</span>
            </div>

            <p className="text-xs font-mono text-slate-300 leading-relaxed">
              Are you sure you want to completely remove product <span className="text-cyan-300 font-bold">"{deletingProduct.name}"</span> and its images? This cannot be undone.
            </p>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingProduct(null)}
                disabled={actionLoading}
                className="px-3 py-1.5 bg-[#030308] border border-slate-800 text-slate-400 hover:text-white rounded-lg text-xs font-mono font-bold transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteProduct}
                disabled={actionLoading}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-mono font-bold transition-all shadow-[0_0_12px_rgba(244,63,94,0.4)] disabled:opacity-50"
              >
                {actionLoading ? 'Deleting...' : 'Delete Completely'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters & Search */}
      <div className="bg-[#080813] border border-cyan-500/20 p-4 rounded-xl flex flex-col md:flex-row gap-4 shadow-[0_0_15px_rgba(34,211,238,0.05)]">
        <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2">
          <input
            type="text"
            placeholder="Search products by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-[#030308] border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all placeholder:text-slate-600"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#030308] border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 hover:text-cyan-200 rounded-lg text-xs font-mono font-bold transition-all"
          >
            Search
          </button>
        </form>

        <div className="flex gap-3">
          <select
            value={selectedCategory}
            onChange={(e) => { setSelectedCategory(e.target.value); setPage(1); }}
            className="bg-[#030308] border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
          >
            <option value="" className="bg-[#030308] text-slate-500">All Categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id} className="bg-[#030308] text-slate-200">{c.name}</option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => { setSelectedStatus(e.target.value); setPage(1); }}
            className="bg-[#030308] border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
          >
            <option value="" className="bg-[#030308] text-slate-500">All Status</option>
            <option value="active" className="bg-[#030308] text-slate-200">Active</option>
            <option value="inactive" className="bg-[#030308] text-slate-200">Inactive</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      {loading ? (
        <div className="p-8 text-center text-slate-400 font-mono text-xs">Loading products...</div>
      ) : error ? (
        <div className="p-3 bg-rose-950/40 border border-rose-500/40 rounded-lg text-rose-300 font-mono text-xs flex items-center space-x-2">
          <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
          <span>[ERROR]: {error}</span>
        </div>
      ) : products.length === 0 ? (
        <div className="p-8 text-center text-slate-500 bg-[#080813] border border-cyan-500/20 rounded-xl font-mono text-xs">
          No products found.
        </div>
      ) : (
        <div className="bg-[#080813] border border-cyan-500/20 rounded-xl overflow-hidden shadow-[0_0_15px_rgba(34,211,238,0.05)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono text-slate-300">
              <thead className="bg-[#030308] text-slate-400 uppercase text-[11px] border-b border-cyan-500/20">
                <tr>
                  <th className="p-3">Product</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Stock</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {products.map((prod) => (
                  <tr key={prod._id} className="hover:bg-[#0c0c1e] transition-colors">
                    <td className="p-3 font-semibold text-slate-100 flex items-center gap-2">
                      <span>{prod.name}</span>
                      {prod.featured && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-fuchsia-950/60 text-fuchsia-400 border border-fuchsia-500/40">
                          🔥 Featured
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-slate-400">{prod.category?.name || 'Unassigned'}</td>
                    <td className="p-3 font-bold text-cyan-300">৳{prod.price}</td>
                    <td className="p-3">
                      <span className={`font-semibold ${prod.stock <= 5 ? 'text-rose-400' : 'text-slate-300'}`}>
                        {prod.stock}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${prod.isActive ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30' : 'bg-rose-950/40 text-rose-400 border-rose-500/30'}`}>
                        {prod.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-1.5">
                      <Link
                        to={`/admin/products/${prod._id}/edit`}
                        className="text-[11px] inline-block bg-[#030308] hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-1 rounded font-semibold transition-all"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => setTogglingProduct(prod)}
                        className={`text-[11px] px-2 py-1 rounded font-semibold border transition-all ${prod.isActive ? 'bg-amber-950/30 text-amber-400 border-amber-500/30' : 'bg-emerald-950/30 text-emerald-400 border-emerald-500/30'}`}
                      >
                        {prod.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => setDeletingProduct(prod)}
                        className="text-[11px] px-2 py-1 rounded font-semibold border bg-rose-950/30 hover:bg-rose-900/50 text-rose-400 border-rose-500/30 transition-all"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="p-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400 bg-[#030308]">
              <span>Showing Page {pagination.page} of {pagination.pages} ({pagination.total} total items)</span>
              <div className="flex space-x-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  className="px-3 py-1 bg-[#080813] border border-slate-800 text-slate-300 hover:border-slate-700 rounded disabled:opacity-50 transition-all"
                >
                  Previous
                </button>
                <button
                  disabled={page === pagination.pages}
                  onClick={() => setPage((p) => Math.min(p + 1, pagination.pages))}
                  className="px-3 py-1 bg-[#080813] border border-slate-800 text-slate-300 hover:border-slate-700 rounded disabled:opacity-50 transition-all"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}