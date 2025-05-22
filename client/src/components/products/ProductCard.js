import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaHeart, FaShoppingCart, FaRegHeart, FaEye } from 'react-icons/fa';
import { addToCart } from '../../slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../../slices/wishlistSlice';
import '../../styles/ProductCard.css';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { wishlist } = useSelector((state) => state.wishlist);
  const { userInfo } = useSelector((state) => state.auth);

  // Check if product is in wishlist
  const isInWishlist = wishlist?.products?.some(
    (item) => item._id === product._id
  );

  const handleAddToCart = () => {
    dispatch(addToCart({ productId: product._id, quantity: 1 }));
  };

  const handleToggleWishlist = () => {
    if (!userInfo) {
      // If not logged in, redirect to login
      window.location.href = '/login';
      return;
    }

    if (isInWishlist) {
      dispatch(removeFromWishlist(product._id));
    } else {
      dispatch(addToWishlist(product._id));
    }
  };

  // Calculate discount percentage
  const discountPercentage = product.onSale && product.salePrice > 0
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  return (
    <div className="product-card">
      <div className="product-card-image">
        <div className="product-image-container">
          <Link to={`/product/${product._id}`} className="product-card-link">
            <img 
              src={product.images[0]?.url || '/placeholder-jewelry.jpg'} 
              alt={product.name} 
              className="product-image"
            />
          </Link>
        </div>
        
        {product.onSale && product.salePrice > 0 && (
          <div className="product-sale-badge">
            -{discountPercentage}%
          </div>
        )}
        
        <div className="product-actions">
          <button 
            className="product-action-btn"
            onClick={handleToggleWishlist}
            aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            {isInWishlist ? <FaHeart /> : <FaRegHeart />}
          </button>
          
          <button 
            className="product-action-btn"
            onClick={handleAddToCart}
            aria-label="Add to cart"
            disabled={!product.isAvailable}
          >
            <FaShoppingCart />
          </button>
          
          <Link 
            to={`/product/${product._id}`} 
            className="product-action-btn"
            aria-label="View product details"
          >
            <FaEye />
          </Link>
        </div>
      </div>
      
      <div className="product-info">
        <div className="product-category">{product.category}</div>
        
        <h3 className="product-title">
          <Link to={`/product/${product._id}`}>{product.name}</Link>
        </h3>
        
        <div className="product-price-container">
          {product.onSale && product.salePrice > 0 ? (
            <>
              <span className="product-sale-price">${product.salePrice.toFixed(2)}</span>
              <span className="product-regular-price">${product.price.toFixed(2)}</span>
            </>
          ) : (
            <span className="product-price">${product.price.toFixed(2)}</span>
          )}
        </div>
        
        {!product.isAvailable && (
          <div className="product-out-of-stock">Out of Stock</div>
        )}
      </div>
      
      <div className="product-card-actions">
        <button 
          className="btn-add-to-cart"
          onClick={handleAddToCart}
          disabled={!product.isAvailable}
        >
          Add to Cart
        </button>
        
        <button 
          className="btn-add-to-wishlist"
          onClick={handleToggleWishlist}
          aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          {isInWishlist ? <FaHeart /> : <FaRegHeart />}
        </button>
      </div>
    </div>
  );
};

export default ProductCard; 