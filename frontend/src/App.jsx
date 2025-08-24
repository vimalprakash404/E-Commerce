import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/common/Header/Header';
import { AppProvider  } from './context/AppContext';
import { CartProvider } from './context/CartContext';
import Hero from './components/Hero/Hero';
import ProductGrid from './components/Product/ProductGrid';
import Footer from './components/common/Footer';

// Pages
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import ProductList from './pages/Products';
import Cart from './components/Cart';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Orders from './pages/Order';
import Bill from './pages/Bill';
import { AuthProvider } from './context/AuthContext';

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
            <Route path="/cart" element={<Cart />} />
            <Route path="*" element={<h2>Page Not Found</h2>} />
            <Route path='/login' element={<Login/>} />
            <Route path='/signup' element={<Signup/>} />
            <Route path='/bill' element={<Bill/>} />
            <Route path='/order' element={<Orders/>} />
          </Routes>
          <Footer />
        </Router>
      </CartProvider>
    </AppProvider>
    </AuthProvider>
  );
}
    