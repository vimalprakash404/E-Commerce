import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/common/Header/Header';
import { AppProvider  } from './context/AppContext';
import { CartProvider } from './context/CartContext';

export default function App() {
  return (
    <AppProvider>
      <CartProvider>
      <Router>
        <Header />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <h1>Welcome to Our E-Commerce Store</h1>
                <p>Shop the latest products at unbeatable prices!</p>
              </>
            }
          />
          {/* Add more routes here as needed */}
        </Routes>
      </Router>
      </CartProvider>
    </AppProvider>
  );
}