import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Header from './Header';
import Footer from './Footer';
import '../../styles/Layout.css';

const Layout = ({ children }) => {
  const { theme } = useSelector((state) => state.ui);
  
  // Apply theme to the document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  
  return (
    <div className="layout">
      <Header />
      <main className="main-content">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout; 