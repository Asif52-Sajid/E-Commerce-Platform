import React, { useEffect, useState } from 'react';
import { reviewService } from '../../services/reviewService';
import { Star, RefreshCw, AlertTriangle, Search, X } from 'lucide-react';

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Custom modal state styled precisely like the screenshot modal with animation added
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info', // 'confirm' or 'alert'
    onConfirm: null,
  });

  const fetchAllReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await reviewService.getAllAdminReviews();
      const reviewList = Array.isArray(res) ? res : (res.data || res.reviews || []);
      setReviews(reviewList);
    } catch (err) {
      console.error('Error loading admin reviews:', err);
      setError(err.response?.data?.message || 'Failed to load reviews.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllReviews();
  }, []);

  const showAlert = (title, message) => {
    setModalConfig({
      isOpen: true,
      title,
      message,
      type: 'alert',
      onConfirm: () => setModalConfig((prev) => ({ ...prev, isOpen: false })),
    });
  };

  const showConfirm = (title, message, onConfirmCallback) => {
    setModalConfig({
      isOpen: true,
      title,
      message,
      type: 'confirm',
      onConfirm: () => {
        setModalConfig((prev) => ({ ...prev, isOpen: false }));
        onConfirmCallback();
      },
    });
  };

  const handleToggleApproval = async (reviewId, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      await reviewService.updateReviewStatus(reviewId, { isApproved: newStatus });
      setReviews((prev) =>
        prev.map((rev) => (rev._id === reviewId ? { ...rev, isApproved: newStatus } : rev))
      );
    } catch (err) {
      showAlert('[SYSTEM ERROR]: UPDATE FAILED', err.response?.data?.message || 'Failed to update review status.');
    }
  };

  const handleDelete = (reviewId) => {
    showConfirm(
      '[SYSTEM WARNING]: PERMANENT DELETION',
      'Are you sure you want to permanently delete this review? This action cannot be undone.',
      async () => {
        try {
          await reviewService.deleteReview(reviewId);
          setReviews((prev) => prev.filter((rev) => rev._id !== reviewId));
        } catch (err) {
          showAlert('[SYSTEM ERROR]: DELETION FAILED', err.response?.data?.message || 'Failed to delete review.');
        }
      }
    );
  };

  const filteredReviews = reviews.filter((rev) => {
    const query = searchTerm.toLowerCase();
    const userName = (rev.user?.name || '').toLowerCase();
    const userEmail = (rev.user?.email || '').toLowerCase();
    const productName = (rev.product?.name || '').toLowerCase();
    const comment = (rev.comment || '').toLowerCase();
    return userName.includes(query) || userEmail.includes(query) || productName.includes(query) || comment.includes(query);
  });

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-[#07090E] flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-cyan-400" />
          <p className="text-xs font-bold text-cyan-400 tracking-wider">LOADING REVIEWS...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-10 space-y-6 max-w-7xl mx-auto bg-[#07090E] min-h-[calc(100vh-80px)] text-white">
      
      {/* Header section styled exactly like the User Management header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-800 pb-6">
        <div>
          <h1 className="text-xl font-bold tracking-wider text-white uppercase">REVIEWS MANAGEMENT</h1>
          <p className="text-xs text-cyan-400 mt-1">&gt; Moderate customer feedback, regulate ratings, and manage reviews.</p>
        </div>
        <button 
          onClick={fetchAllReviews} 
          className="px-4 py-2 bg-transparent hover:bg-cyan-950/30 border border-cyan-800/60 text-cyan-400 text-xs font-bold rounded-lg transition-colors"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-950/40 border border-red-500/30 text-red-400 text-xs font-bold rounded-xl flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" /> 
          <span>{error}</span>
        </div>
      )}

      {/* Search Bar matching theme style */}
      <div className="flex items-center gap-3 bg-[#0B101D] border border-cyan-900/40 rounded-xl px-4 py-2.5 max-w-md">
        <Search className="w-4 h-4 text-cyan-500" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search review by user, product, or comment..."
          className="bg-transparent border-none text-xs text-white placeholder-cyan-700 focus:outline-none w-full"
        />
        {searchTerm && (
          <button onClick={() => setSearchTerm('')} className="text-cyan-600 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Table matching the exact dark admin panel theme */}
      <div className="border border-cyan-950 rounded-2xl overflow-hidden bg-[#0A0D18]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-cyan-950 bg-[#0B0F1A] text-[10px] font-bold uppercase tracking-widest text-cyan-400">
              <th className="p-4">User</th>
              <th className="p-4">Product</th>
              <th className="p-4">Rating</th>
              <th className="p-4">Comment</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cyan-950/60 text-xs font-medium">
            {filteredReviews.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-12 text-center text-cyan-600">No customer reviews found.</td>
              </tr>
            ) : (
              filteredReviews.map((rev) => (
                <tr key={rev._id} className="hover:bg-cyan-950/10 transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-white">{rev.user?.name || 'Anonymous'}</p>
                    <p className="text-[10px] text-cyan-500/80">{rev.user?.email}</p>
                  </td>
                  
                  <td className="p-4 font-bold text-cyan-200">{rev.product?.name || 'Product'}</td>

                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-400 font-bold">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {rev.rating}
                    </span>
                  </td>

                  <td className="p-4 max-w-xs text-cyan-100/90 leading-relaxed">{rev.comment}</td>

                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                      rev.isApproved ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                    }`}>
                      {rev.isApproved ? 'Approved' : 'Pending'}
                    </span>
                  </td>

                  <td className="p-4 text-right space-x-2 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleApproval(rev._id, rev.isApproved)}
                      className={`px-3 py-1 rounded-lg font-bold text-xs border transition-colors ${
                        rev.isApproved 
                          ? 'border-amber-500/40 text-amber-400 hover:bg-amber-500/10' 
                          : 'border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10'
                      }`}
                    >
                      {rev.isApproved ? 'Disallow' : 'Allow'}
                    </button>
                    <button
                      onClick={() => handleDelete(rev._id)}
                      className="px-3 py-1 border border-red-500/40 text-red-400 hover:bg-red-500/10 rounded-lg font-bold text-xs transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Custom Dialog Box with entrance animation and non-blurred dark background */}
      {modalConfig.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 animate-in fade-in duration-200">
          <div className="bg-[#0B0F1A] border border-red-500/40 rounded-2xl p-6 max-w-md w-full shadow-[0_0_30px_rgba(239,68,68,0.15)] relative space-y-4 animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center gap-2 text-red-500 font-bold text-xs tracking-wider">
              <span className="w-2 h-2 rounded-full bg-red-500 inline-block shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse" />
              <span>{modalConfig.title}</span>
            </div>

            <div className="text-xs text-cyan-100/90 leading-relaxed space-y-1 pl-4">
              <p>{modalConfig.message}</p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              {modalConfig.type === 'confirm' && (
                <button
                  type="button"
                  onClick={() => setModalConfig((prev) => ({ ...prev, isOpen: false }))}
                  className="px-5 py-2 rounded-xl bg-transparent hover:bg-cyan-950/40 border border-cyan-800/50 text-cyan-300 text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
              )}
              <button
                type="button"
                onClick={modalConfig.onConfirm}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white text-xs font-bold shadow-[0_0_15px_rgba(239,68,68,0.4)] transition-all"
              >
                {modalConfig.type === 'confirm' ? 'Delete Permanently' : 'Got it'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}