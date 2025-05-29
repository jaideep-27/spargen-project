import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProductDetails } from '../slices/productSlice';
import { addToCart } from '../slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../slices/wishlistSlice';
import { getRandomCategoryImage } from '../utils/imageUtils';
import ProductImage from '../components/ProductImage';
import Alert from '../components/ui/Alert';
import '../styles/product-detail.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { product, loading: productSliceLoading, error } = useSelector((state) => state.product);
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
      const items = Array.isArray(wishlistItems) ? wishlistItems : (wishlistItems.products || []);
      setIsInWishlist(items.some(item => item.product?._id === product._id));
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

  const getDisplayImages = () => {
    if (product && product.images && product.images.length > 0) {
      return product.images;
    }
    if (product) {
      return [{ url: getRandomCategoryImage(product.category || 'jewelry'), altText: product.name }];
    }
    return [];
  };

  if (productSliceLoading && !product) {
    return null;
  }

  if (error) {
    return <div className="container"><Alert type="error" message={error} /></div>;
  }

  if (!product) {
    return <div className="container"><Alert type="error" message="Product not found." /></div>;
  }

  const displayImages = getDisplayImages();

  return (
    <div className="product-detail-container">
      <div className="product-detail-grid">
        <div className="product-images">
          <div className="main-image">
            {displayImages.length > 0 ? (
              <ProductImage 
                image={displayImages[selectedImage]?.url}
                altText={displayImages[selectedImage]?.altText || product.name}
                category={product.category}
                width="100%"
                height="100%"
              />
            ) : (
              <ProductImage 
                image={getRandomCategoryImage(product.category || 'jewelry')}
                altText={product.name}
                category={product.category}
                width="100%"
                height="100%"
              />
            )}
          </div>
          
          {displayImages.length > 1 && (
            <div className="thumbnail-container">
              {displayImages.map((img, index) => (
                <div 
                  key={index} 
                  className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                  onClick={() => setSelectedImage(index)}
                >
                  <ProductImage 
                    image={img.url}
                    altText={img.altText || `${product.name} thumbnail ${index + 1}`}
                    category={product.category}
                    width="80px"
                    height="80px"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="product-info">
          <h1 className="product-name">{product.name}</h1>
          
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
              <label htmlFor="quantity">Quantity:</label>
              <input
                type="number"
                id="quantity"
                min="1"
                max={product.stockQuantity > 10 ? 10 : product.stockQuantity || 1}
                value={quantity}
                onChange={handleQuantityChange}
                disabled={!product.isAvailable || product.stockQuantity === 0}
              />
            </div>
            
            <button 
              className="btn btn-primary btn-add-to-cart"
              onClick={handleAddToCart}
              disabled={!product.isAvailable || product.stockQuantity === 0}
            >
              {product.isAvailable ? 'Add to Cart' : 'Out of Stock'}
            </button>
            
            <button 
              className={`btn btn-wishlist ${isInWishlist ? 'active' : ''}`}
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