import React from 'react';
import ProductCard from './ProductCard';
import '../styles/ProductGrid.css';

const ProductGrid = ({ products, title = 'Featured Products' }) => {
  if (!products || products.length === 0) {
    return null;
  }
  
  return (
    <div className="product-grid-container">
      <div className="product-grid-header">
        <h2 className="product-grid-title">{title}</h2>
        {title === 'Featured Products' && (
          <a href="/shop" className="view-all-link">
            View All
            <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 9L13 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M1 5H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        )}
      </div>
      
      <div className="product-grid">
        {products.map((product) => (
          <div key={product._id} className="product-grid-item">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductGrid; 