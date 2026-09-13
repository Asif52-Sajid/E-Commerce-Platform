import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/layouts/Navbar';
import Footer from './components/layouts/Footer';

import ProtectedRoute from './common/ProtectedRoute';
import AdminRoute from './common/AdminRoute';

import { CartProvider, useCart } from './context/CartContext';
import { WishlistProvider, useWishlist } from './context/WishlistContext';
import { AuthProvider } from './context/AuthContext';

import Profile from './pages/Profile'; 
import Register from './pages/Register';
import Login from './pages/Login';
import HomePage from './pages/HomePage';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';

import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import MyOrders from './pages/MyOrders';
import OrderDetails from './pages/OrderDetails';

// Footer Links
import CustomerHelpDesk from './components/FooterLinks/CustomerHelpDesk';
import FAQ from './components/FooterLinks/FAQ';
import PrivacyTerms from './components/FooterLinks/PrivacyTerms';

// Admin Imports
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminProductForm from './pages/admin/AdminProductForm';
import AdminCategories from './pages/admin/AdminCategories';
import AdminOrders from './pages/admin/AdminOrders';
import AdminOrderDetail from './pages/admin/AdminOrderDetail';
import AdminInventory from './pages/admin/AdminInventory';
import AdminUsers from './pages/admin/AdminUsers';
import AdminReviews from './pages/admin/AdminReviews';

// Global Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[Application Crash]:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center shadow-2xl">
            <h2 className="text-2xl font-black text-white mb-2">Something went wrong</h2>
            <p className="text-slate-400 text-sm mb-6"> An unexpected error occurred. Please try reloading the page.</p>
            <button
              onClick={() => window.location.assign('/')}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all cursor-pointer"
            >
              Return to Homepage
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const NotFoundPlaceholder = () => (
  <div className="max-w-7xl mx-auto px-4 py-24 text-center">
    <h1 className="text-7xl font-black text-blue-500">404</h1>
    <p className="text-slate-100 font-extrabold text-xl mt-3">Page Not Found</p>
  </div>
);

function ConnectedLayout({ children }) {
  const { totalCount } = useCart();
  const { totalWishlistCount } = useWishlist();
  const location = useLocation();

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const isAdminPage = location.pathname.startsWith('/admin');

  if (isAdminPage) {
    return children;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans antialiased selection:bg-blue-500 selection:text-white">
      {!isAuthPage && <Navbar cartCount={totalCount} wishlistCount={totalWishlistCount} />}
      <main className="flex-1">{children}</main>
      {!isAuthPage && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Router>
              <ConnectedLayout>
                <Routes>
                  {/* Public & Customer Routes */}
                  <Route path="/register" element={<Register />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/" element={<HomePage />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/products/:id" element={<ProductDetail />} />

                  {/* Footer Static Link Routes */}
                  <Route path="/help-desk" element={<CustomerHelpDesk />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/privacy-terms" element={<PrivacyTerms />} />

                  <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                  <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                  <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
                  <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                  <Route path="/order-success/:id" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
                  <Route path="/my-orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
                  <Route path="/orders/:id" element={<ProtectedRoute><OrderDetails /></ProtectedRoute>} />

                  {/* Admin Routes */}
                  <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                  <Route path="/admin/dashboard" element={<AdminRoute><AdminLayout><AdminDashboard /></AdminLayout></AdminRoute>} />
                  <Route path="/admin/products" element={<AdminRoute><AdminLayout><AdminProducts /></AdminLayout></AdminRoute>} />
                  <Route path="/admin/products/new" element={<AdminRoute><AdminLayout><AdminProductForm /></AdminLayout></AdminRoute>} />
                  <Route path="/admin/products/:id/edit" element={<AdminRoute><AdminLayout><AdminProductForm /></AdminLayout></AdminRoute>} />
                  <Route path="/admin/categories" element={<AdminRoute><AdminLayout><AdminCategories /></AdminLayout></AdminRoute>} />
                  <Route path="/admin/orders" element={<AdminRoute><AdminLayout><AdminOrders /></AdminLayout></AdminRoute>} />
                  <Route path="/admin/orders/:id" element={<AdminRoute><AdminLayout><AdminOrderDetail /></AdminLayout></AdminRoute>} />
                  <Route path="/admin/inventory" element={<AdminRoute><AdminLayout><AdminInventory /></AdminLayout></AdminRoute>} />
                  <Route path="/admin/users" element={<AdminRoute><AdminLayout><AdminUsers /></AdminLayout></AdminRoute>} />
                  <Route path="/admin/reviews" element={<AdminRoute><AdminLayout><AdminReviews /></AdminLayout></AdminRoute>} />

                  {/* Fallback */}
                  <Route path="*" element={<NotFoundPlaceholder />} />
                </Routes>
              </ConnectedLayout>
            </Router>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}