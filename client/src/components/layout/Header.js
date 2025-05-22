import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaSearch, FaShoppingCart, FaUser, FaHeart, FaMoon, FaSun } from 'react-icons/fa';
import { toggleTheme } from '../../slices/uiSlice';
import { logout } from '../../slices/authSlice';
import '../../styles/Header.css';

const Header = () => {
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.ui);
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const { dbCart } = useSelector((state) => state.cart);
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate cart items count
  const cartItemsCount = userInfo 
    ? (dbCart?.items?.length || 0) 
    : cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Redirect to search results page
    if (searchQuery.trim()) {
      window.location.href = `/search?query=${searchQuery}`;
    }
  };

  // Get user's first name safely
  const getFirstName = () => {
    if (userInfo && userInfo.name) {
      return userInfo.name.split(' ')[0];
    }
    return 'User';
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo-container">
            <Link to="/" className="logo">
              GlimmerGem
            </Link>
          </div>

          <div className="search-container">
            <form onSubmit={handleSearch}>
              <div className="search-input-container">
                <input
                  type="text"
                  placeholder="Search jewelry..."
                  className="search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="search-btn">
                  <FaSearch />
                </button>
              </div>
            </form>
          </div>

          <div className="nav-actions">
            <button 
              className="theme-toggle" 
              onClick={handleThemeToggle}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <FaMoon /> : <FaSun />}
            </button>
            
            <Link to="/wishlist" className="action-btn">
              <FaHeart />
            </Link>
            
            <Link to="/cart" className="action-btn cart-btn">
              <FaShoppingCart />
              {cartItemsCount > 0 && (
                <span className="cart-badge">{cartItemsCount}</span>
              )}
            </Link>
            
            {userInfo ? (
              <div className="user-menu">
                <Link to="/profile" className="user-btn">
                  <FaUser />
                  <span className="user-name">{getFirstName()}</span>
                </Link>
                <div className="user-dropdown">
                  <Link to="/profile">Profile</Link>
                  <Link to="/orders">Orders</Link>
                  {userInfo.role === 'admin' && (
                    <Link to="/admin/dashboard">Dashboard</Link>
                  )}
                  <button onClick={handleLogout}>Logout</button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="login-btn">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 