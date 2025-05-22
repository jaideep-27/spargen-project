import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../slices/cartSlice';
import { addToWishlist } from '../slices/wishlistSlice';
import ProductImage from './ProductImage';
import '../styles/ProductCard.css';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  
  // Handle add to cart
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    dispatch(addToCart({
      productId: product._id,
      quantity: 1
    }));
  };
  
  // Handle add to wishlist
  const handleAddToWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    dispatch(addToWishlist(product._id));
  };
  
  return (
    <div className="product-card">
      <Link to={`/product/${product._id}`} className="product-card-link">
        <div className="product-card-image">
          <ProductImage 
            image={product.images && product.images.length > 0 ? product.images[0] : null}
            altText={product.name}
          />
          {product.onSale && <span className="product-sale-badge">SALE</span>}
        </div>
        
        <div className="product-card-content">
          <h3 className="product-card-title">{product.name}</h3>
          
          <div className="product-card-category">
            {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
            {product.gemstone && product.gemstone !== 'other' && product.gemstone !== 'none' && 
              ` • ${product.gemstone.charAt(0).toUpperCase() + product.gemstone.slice(1)}`}
          </div>
          
          <div className="product-card-price">
            {product.onSale && product.salePrice > 0 ? (
              <>
                <span className="product-original-price">${product.price.toFixed(2)}</span>
                <span className="product-sale-price">${product.salePrice.toFixed(2)}</span>
              </>
            ) : (
              <span>${product.price.toFixed(2)}</span>
            )}
          </div>
          
          <div className="product-card-rating">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={`star ${i < Math.round(product.rating?.average || 0) ? 'filled' : ''}`}>
                ★
              </span>
            ))}
            <span className="rating-count">({product.rating?.count || 0})</span>
          </div>
        </div>
      </Link>
      
      <div className="product-card-actions">
        <button 
          className="btn-add-to-cart" 
          onClick={handleAddToCart}
          disabled={!product.isAvailable}
        >
          {product.isAvailable ? 'Add to Cart' : 'Out of Stock'}
        </button>
        
        <button 
          className="btn-add-to-wishlist" 
          onClick={handleAddToWishlist}
          aria-label="Add to wishlist"
        >
          <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 17.5L8.55 16.1913C3.4 11.565 0 8.52375 0 4.95C0 1.90875 2.42 0 5.5 0C7.24 0 8.91 0.72125 10 1.97375C11.09 0.72125 12.76 0 14.5 0C17.58 0 20 1.90875 20 4.95C20 8.52375 16.6 11.565 11.45 16.1913L10 17.5Z" fill="currentColor" fillOpacity="0.25"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ProductCard; 