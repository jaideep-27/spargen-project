import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaHeart, FaShoppingCart, FaRegHeart, FaEye } from 'react-icons/fa';
import { addToCart } from '../../slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../../slices/wishlistSlice';
import { getRandomCategoryImage } from '../../utils/imageUtils';
import ProductImage from '../ProductImage';
import '../../styles/ProductCard.css';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { wishlist } = useSelector((state) => state.wishlist);
  const { userInfo } = useSelector((state) => state.auth);

  // Check if product is in wishlist
  const isInWishlist = wishlist?.products?.some(
    (item) => item._id === product._id
  );

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!userInfo) {
      navigate('/login', { state: { from: `/product/${product._id}` } });
      return;
    }

    try {
      await dispatch(addToCart({
        productId: product._id,
        quantity: 1
      })).unwrap();
    } catch (error) {
      console.error('Add to cart error:', error);
    }
  };

  const handleToggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!userInfo) {
      navigate('/login', { state: { from: `/product/${product._id}` } });
      return;
    }

    try {
    if (isInWishlist) {
        await dispatch(removeFromWishlist(product._id)).unwrap();
    } else {
        await dispatch(addToWishlist(product._id)).unwrap();
      }
    } catch (error) {
      console.error('Wishlist toggle error:', error);
    }
  };

  // Calculate discount percentage
  const discountPercentage = product.onSale && product.salePrice > 0
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  // Get product image URL
  const getProductImage = () => {
    if (product.images && product.images.length > 0) {
      return product.images[0].url;
    }
    return getRandomCategoryImage(product.category || 'jewelry');
  };

  return (
    <div className="product-card">
      <div className="product-card-image">
        <div className="product-image-container">
          <Link to={`/product/${product._id}`} className="product-card-link">
            <ProductImage 
              image={getProductImage()}
              altText={product.name}
              category={product.category}
              width="100%"
              height="100%"
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
            className={`product-action-btn ${isInWishlist ? 'active' : ''}`}
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