import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/common/Header/Header';
import { AppProvider } from './context/AppContext';
import { CartProvider } from './context/CartContext';
import Footer from './components/common/Footer';
import { AuthProvider } from './context/AuthContext';
import AuthGuard from './components/common/AuthGuard';
import ProtectedRoute from './components/common/ProtectedRoute';
import PublicRoute from './components/common/PublicRoute';

// Pages
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import ProductList from './pages/Products';
import Cart from './components/Cart';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Orders from './pages/Order';
import Bill from './pages/Bill';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <CartProvider>
          <Router>
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<ProductList />} />
              <Route path="/product-details/" element={<ProductDetail />} />
              <Route path="/cart" element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              } />
              <Route path="*" element={<h2>Page Not Found</h2>} />
              <Route path='/login' element={
                <PublicRoute>
                  <Login/>
                </PublicRoute>
              } />
              <Route path='/signup' element={
                <PublicRoute>
                  <Signup/>
                </PublicRoute>
              } />
              <Route path='/bill' element={
                <ProtectedRoute>
                  <Bill/>
                </ProtectedRoute>
              } />
              <Route path='/order' element={
                <ProtectedRoute>
                  <Orders/>
                </ProtectedRoute>
              } />
              <Route path='/admin' element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminDashboard/>
                </ProtectedRoute>
              } />
            </Routes>
            <Footer />
          </Router>
        </CartProvider>
      </AppProvider>
    </AuthProvider>
  );
}
    