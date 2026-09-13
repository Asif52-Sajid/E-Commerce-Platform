import React, { useEffect, useState } from 'react';
import adminService from '../../services/adminService';

export default function AdminInventory() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');
  const [stockFilter, setStockFilter] = useState('');
  const [threshold, setThreshold] = useState(5);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  const [editingStockId, setEditingStockId] = useState(null);
  const [tempStockValue, setTempStockValue] = useState('');
  const [savingId, setSavingId] = useState(null);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const res = await adminService.getAdminInventory({
        page,
        limit: 10,
        search,
        stockFilter,
        threshold,
      });
      setProducts(res.data);
      setPagination(res.pagination);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch inventory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [page, stockFilter, threshold]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchInventory();
  };

  const handleStartStockEdit = (prod) => {
    setEditingStockId(prod._id);
    setTempStockValue(prod.stock);
  };

  const handleSaveStock = async (id) => {
    if (tempStockValue === '' || Number(tempStockValue) < 0) return;
    try {
      setSavingId(id);
      await adminService.updateProductStock(id, Number(tempStockValue));
      setEditingStockId(null);
      fetchInventory();
    } catch (err) {
      alert(err.response?.data?.message || 'Stock update failed');
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-cyan-500/20 pb-4">
        <h1 className="text-xl font-mono font-black uppercase tracking-wider bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-white bg-clip-text text-transparent">
          Inventory & Stock Alerts
        </h1>
        <p className="text-slate-400 font-mono text-xs mt-1">
          &gt; Monitor real-time stock levels and perform quick stock updates
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-[#080813] border border-cyan-500/20 p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center justify-between shadow-[0_0_15px_rgba(34,211,238,0.05)]">
        <form onSubmit={handleSearchSubmit} className="flex-1 w-full flex gap-2">
          <input
            type="text"
            placeholder="Search product by name..."
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

        <div className="flex w-full md:w-auto gap-3">
          <select
            value={stockFilter}
            onChange={(e) => { setStockFilter(e.target.value); setPage(1); }}
            className="bg-[#030308] border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
          >
            <option value="" className="bg-[#030308] text-slate-500">All Stock Statuses</option>
            <option value="low" className="bg-[#030308] text-slate-200">Low Stock (≤ {threshold})</option>
            <option value="out" className="bg-[#030308] text-slate-200">Out of Stock (0)</option>
            <option value="in" className="bg-[#030308] text-slate-200">In Stock (&gt; {threshold})</option>
          </select>

          <div className="flex items-center space-x-2 bg-[#030308] border border-slate-800 rounded-lg px-3 py-1 text-xs font-mono text-slate-400">
            <span>Threshold:</span>
            <input
              type="number"
              min="1"
              max="100"
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              className="w-12 bg-[#080813] text-center font-bold text-cyan-300 border border-slate-800 rounded focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      {loading ? (
        <div className="p-8 text-center text-slate-400 font-mono text-xs">Loading inventory data...</div>
      ) : error ? (
        <div className="p-3 bg-rose-950/40 border border-rose-500/40 rounded-lg text-rose-300 font-mono text-xs flex items-center space-x-2">
          <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
          <span>[ERROR]: {error}</span>
        </div>
      ) : products.length === 0 ? (
        <div className="p-8 text-center text-slate-500 bg-[#080813] border border-cyan-500/20 rounded-xl font-mono text-xs">
          No inventory items match filter.
        </div>
      ) : (
        <div className="bg-[#080813] border border-cyan-500/20 rounded-xl overflow-hidden shadow-[0_0_15px_rgba(34,211,238,0.05)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono text-slate-300">
              <thead className="bg-[#030308] text-slate-400 uppercase text-[11px] border-b border-cyan-500/20">
                <tr>
                  <th className="p-3">Product Name</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Current Stock</th>
                  <th className="p-3">Status Alert</th>
                  <th className="p-3 text-right">Quick Stock Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {products.map((prod) => {
                  const isOut = prod.stock === 0;
                  const isLow = prod.stock > 0 && prod.stock <= threshold;

                  return (
                    <tr key={prod._id} className="hover:bg-[#0c0c1e] transition-colors">
                      <td className="p-3 font-semibold text-slate-100">{prod.name}</td>
                      <td className="p-3 text-slate-400">{prod.category?.name || 'Unassigned'}</td>
                      <td className="p-3 font-bold text-cyan-300">৳{prod.price}</td>
                      <td className="p-3">
                        {editingStockId === prod._id ? (
                          <input
                            type="number"
                            min="0"
                            value={tempStockValue}
                            onChange={(e) => setTempStockValue(e.target.value)}
                            className="w-20 bg-[#030308] border border-cyan-400 rounded px-2 py-1 text-xs font-bold text-cyan-300 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                          />
                        ) : (
                          <span className="font-bold text-slate-100">{prod.stock}</span>
                        )}
                      </td>
                      <td className="p-3">
                        {isOut ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-950/40 text-rose-400 border border-rose-500/30">
                            Out of Stock
                          </span>
                        ) : isLow ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-950/40 text-amber-400 border border-amber-500/30">
                            Low Stock
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-950/40 text-emerald-400 border border-emerald-500/30">
                            Optimal
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        {editingStockId === prod._id ? (
                          <div className="flex justify-end space-x-1.5">
                            <button
                              onClick={() => handleSaveStock(prod._id)}
                              disabled={savingId === prod._id}
                              className="text-[11px] bg-cyan-600 hover:bg-cyan-500 text-white px-2.5 py-1 rounded font-bold transition-all shadow-[0_0_10px_rgba(34,211,238,0.3)] disabled:opacity-50"
                            >
                              {savingId === prod._id ? 'Saving...' : 'Save'}
                            </button>
                            <button
                              onClick={() => setEditingStockId(null)}
                              className="text-[11px] bg-[#030308] hover:bg-slate-800 text-slate-300 border border-slate-800 px-2.5 py-1 rounded font-semibold transition-all"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleStartStockEdit(prod)}
                            className="text-[11px] bg-[#030308] hover:bg-cyan-500/20 text-cyan-300 hover:text-cyan-200 border border-cyan-500/30 px-2.5 py-1 rounded font-semibold transition-all"
                          >
                            Update Quantity
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="p-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400 bg-[#030308]">
              <span>Showing Page {pagination.page} of {pagination.pages} ({pagination.total} total products)</span>
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