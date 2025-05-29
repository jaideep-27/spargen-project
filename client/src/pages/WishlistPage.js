import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { getWishlist, removeFromWishlist } from '../slices/wishlistSlice';
import { addToCart } from '../slices/cartSlice';
import Alert from '../components/ui/Alert';
import ProductImage from '../components/ProductImage';
import '../styles/wishlist.css';

const WishlistPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { wishlist, loading, error } = useSelector((state) => state.wishlist);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!userInfo) {
      navigate('/login', { state: { from: '/wishlist' } });
    } else {
      dispatch(getWishlist());
    }
  }, [dispatch, userInfo, navigate]);

  const handleRemoveItem = async (productId) => {
    try {
      await dispatch(removeFromWishlist(productId)).unwrap();
    } catch (error) {
      console.error('Failed to remove item from wishlist:', error);
    }
  };

  const handleAddToCart = async (e, productId) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await dispatch(addToCart({ productId, quantity: 1 })).unwrap();
      await dispatch(removeFromWishlist(productId)).unwrap();
    } catch (error) {
      console.error('Failed to add item to cart:', error);
    }
  };

  if (loading) {
    return (
      <div className="wishlist-container">
        <h1 className="wishlist-title">Your Wishlist</h1>
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="wishlist-container">
        <h1 className="wishlist-title">Your Wishlist</h1>
        <Alert type="error" message={error} />
      </div>
    );
  }
  
  if (!wishlist || !wishlist.products || wishlist.products.length === 0) {
    return (
      <div className="wishlist-container">
        <h1 className="wishlist-title">Your Wishlist</h1>
        <div className="empty-wishlist">
          <p>Your wishlist is empty.</p>
          <Link to="/shop" className="btn-continue-shopping">
            Explore Our Collection
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="wishlist-container">
      <h1 className="wishlist-title">Your Wishlist</h1>
        <div className="wishlist-grid">
          {wishlist.products.map((item) => (
            <div key={item._id} className="wishlist-item">
              <button 
                className="btn-remove-item"
                onClick={() => handleRemoveItem(item._id)}
              aria-label="Remove from wishlist"
              >
                &times;
              </button>
              
              <Link to={`/product/${item._id}`} className="item-image-link">
                <ProductImage 
                  image={item.images && item.images.length > 0 ? item.images[0].url : null} 
                  altText={item.name}
                  category={item.category}
                />
              </Link>
              
              <div className="item-details">
                <h3 className="item-name">
                  <Link to={`/product/${item._id}`}>
                    {item.name}
                  </Link>
                </h3>
                
              <p className="item-price">
                {item.onSale && item.salePrice > 0 ? (
                  <>
                    <span className="sale-price">${item.salePrice.toFixed(2)}</span>
                    <span className="original-price">${item.price.toFixed(2)}</span>
                  </>
                ) : (
                  <>${item.price.toFixed(2)}</>
                )}
              </p>
                
                <div className="item-meta">
                  {item.category && (
                    <span className="item-category">{item.category}</span>
                  )}
                </div>
                
                <button 
                  className="btn-add-to-cart"
                onClick={(e) => handleAddToCart(e, item._id)}
                disabled={!item.isAvailable}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
    </div>
  );
};

export default WishlistPage; 