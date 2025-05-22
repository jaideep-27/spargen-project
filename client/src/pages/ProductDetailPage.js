import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProductDetails } from '../slices/productSlice';
import { addToCart } from '../slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../slices/wishlistSlice';
import Loader from '../components/ui/Loader';
import Alert from '../components/ui/Alert';
import '../styles/product-detail.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { product, loading, error } = useSelector((state) => state.product);
  const { wishlistItems } = useSelector((state) => state.wishlist);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(getProductDetails(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (wishlistItems && product) {
      setIsInWishlist(wishlistItems.some(item => item.product._id === product._id));
    }
  }, [wishlistItems, product]);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/product/${id}` } });
      return;
    }
    dispatch(addToCart({ productId: product._id, quantity }));
  };

  const handleWishlist = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/product/${id}` } });
      return;
    }
    
    if (isInWishlist) {
      dispatch(removeFromWishlist(product._id));
    } else {
      dispatch(addToWishlist(product._id));
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= 10) {
      setQuantity(value);
    }
  };

  if (loading) return <Loader />;
  if (error) return <Alert type="error" message={error} />;
  if (!product) return <Alert type="error" message="Product not found" />;

  return (
    <div className="product-detail-container">
      <div className="product-detail-grid">
        <div className="product-images">
          <div className="main-image">
            <img 
              src={product.images && product.images[selectedImage]} 
              alt={product.name}
            />
          </div>
          
          {product.images && product.images.length > 1 && (
            <div className="thumbnail-container">
              {product.images.map((image, index) => (
                <div 
                  key={index} 
                  className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img src={image} alt={`${product.name} thumbnail ${index + 1}`} />
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="product-info">
          <h1 className="product-name">{product.name}</h1>
          <p className="product-price">${product.price.toFixed(2)}</p>
          
          <div className="product-description">
            <p>{product.description}</p>
          </div>
          
          <div className="product-meta">
            {product.category && (
              <div className="meta-item">
                <span className="meta-label">Category:</span>
                <span className="meta-value">{product.category}</span>
              </div>
            )}
            
            {product.metal && (
              <div className="meta-item">
                <span className="meta-label">Metal:</span>
                <span className="meta-value">{product.metal}</span>
              </div>
            )}
            
            {product.gemstones && product.gemstones.length > 0 && (
              <div className="meta-item">
                <span className="meta-label">Gemstones:</span>
                <span className="meta-value">{product.gemstones.join(', ')}</span>
              </div>
            )}
          </div>
          
          <div className="product-actions">
            <div className="quantity-selector">
              <button 
                className="quantity-btn"
                onClick={() => quantity > 1 && setQuantity(quantity - 1)}
              >
                -
              </button>
              <input 
                type="number" 
                min="1" 
                max="10"
                value={quantity}
                onChange={handleQuantityChange}
              />
              <button 
                className="quantity-btn"
                onClick={() => quantity < 10 && setQuantity(quantity + 1)}
              >
                +
              </button>
            </div>
            
            <button 
              className="btn-add-to-cart"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
            
            <button 
              className={`btn-wishlist ${isInWishlist ? 'active' : ''}`}
              onClick={handleWishlist}
            >
              {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage; 