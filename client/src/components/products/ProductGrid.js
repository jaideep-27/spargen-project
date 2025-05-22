import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import { FaArrowRight } from 'react-icons/fa';
import '../../styles/ProductGrid.css';

const ProductGrid = ({ products, loading, error, title = "Our Collection", viewAllLink, useAltLayout = false }) => {
  if (loading) {
    return (
      <div className="product-grid-loading">
        <div className="loading-spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-grid-error">
        <p>Error loading products: {error}</p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="product-grid-empty">
        <p>No products found.</p>
      </div>
    );
  }

  return (
    <div className="product-grid-container">
      <div className="product-grid-header">
        <h2 className="product-grid-title">{title}</h2>
        {viewAllLink && (
          <Link to={viewAllLink} className="view-all-link">
            View All <FaArrowRight />
          </Link>
        )}
      </div>
      
      <div className={useAltLayout ? "product-grid-alt" : "product-grid"}>
        {products.map((product) => (
          <div className="product-grid-item" key={product._id}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductGrid; 