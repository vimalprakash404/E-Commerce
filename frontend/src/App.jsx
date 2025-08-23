import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/common/Header/Header';
import { AppProvider  } from './context/AppContext';
import { CartProvider } from './context/CartContext';
import Hero from './components/Hero/Hero';

export default function App() {
  return (
    <AppProvider>
      <CartProvider>
      <Router>
        <Header />
        <Hero/>
      </Router>
      </CartProvider>
    </AppProvider>
  );
}