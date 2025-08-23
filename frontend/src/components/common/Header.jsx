import React from 'react';
import { Search, ShoppingCart, User, Menu } from 'lucide-react';

const Header = ({ user, cartItemsCount, onCartClick, onAuthClick, onSearch, searchQuery }) => {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          {/* Logo */}
          <div className="logo">
            <div className="logo-icon">
              <span>E</span>
            </div>
            <span className="logo-text">EcoShop</span>
          </div>

          {/* Search Bar */}
          <div className="search-container">
            <div className="search-wrapper">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="header-actions">
            <button
              onClick={onAuthClick}
              className="header-button"
            >
              <User size={20} />
              <span className="hidden sm:block">
                {user ? user.name : 'Sign In'}
              </span>
            </button>

            <button
              onClick={onCartClick}
              className="header-button"
            >
              <ShoppingCart size={20} />
              {cartItemsCount > 0 && (
                <span className="cart-badge">
                  {cartItemsCount}
                </span>
              )}
              <span className="hidden sm:block">Cart</span>
            </button>

            <button className="header-button md:hidden">
              <Menu size={20} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;