import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCart, syncCartWithDatabase } from './slices/cartSlice';
import { getWishlist } from './slices/wishlistSlice';
import { getUserProfile } from './slices/authSlice';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import ProfilePage from './pages/ProfilePage';
import OrdersPage from './pages/OrdersPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import './styles/main.css';

function App() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const prevUserInfo = React.useRef(userInfo);

  useEffect(() => {
    if (!isAuthenticated) {
        dispatch(getUserProfile());
    }
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    if (userInfo && !prevUserInfo.current) {
        if (isAuthenticated) { 
            dispatch(getCart());
            dispatch(getWishlist());
        }
    } else if (!userInfo && prevUserInfo.current) {
    }
    prevUserInfo.current = userInfo;
  }, [dispatch, userInfo, isAuthenticated]);
  
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-confirmation/:id" element={<OrderConfirmationPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/verify-email/:verificationToken" element={<VerifyEmailPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
