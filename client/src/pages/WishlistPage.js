import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { getWishlist, removeFromWishlist } from '../slices/wishlistSlice';
import { addToCart } from '../slices/cartSlice';
import Loader from '../components/ui/Loader';
import Alert from '../components/ui/Alert';
import '../styles/wishlist.css';

const WishlistPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { wishlist, loading, error } = useSelector((state) => state.wishlist);
  const { userInfo, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getWishlist());
    } else {
      navigate('/login', { state: { from: '/wishlist' } });
    }
  }, [dispatch, isAuthenticated, navigate]);

  const handleRemoveItem = (productId) => {
    dispatch(removeFromWishlist(productId));
  };

  const handleAddToCart = (productId) => {
    dispatch(addToCart({ productId, quantity: 1 }));
    dispatch(removeFromWishlist(productId));
  };

  if (loading) return <Loader />;
  if (error) return <Alert type="error" message={error} />;
  
  // Guard clause to prevent the error when wishlist is null/undefined
  if (!wishlist || !wishlist.products) {
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
      
      {wishlist.products.length === 0 ? (
        <div className="empty-wishlist">
          <p>Your wishlist is empty.</p>
          <Link to="/shop" className="btn-continue-shopping">
            Explore Our Collection
          </Link>
        </div>
      ) : (
        <div className="wishlist-grid">
          {wishlist.products.map((item) => (
            <div key={item._id} className="wishlist-item">
              <button 
                className="btn-remove-item"
                onClick={() => handleRemoveItem(item._id)}
              >
                &times;
              </button>
              
              <Link to={`/product/${item._id}`} className="item-image">
                <img 
                  src={item.images && item.images[0]} 
                  alt={item.name}
                />
              </Link>
              
              <div className="item-details">
                <h3 className="item-name">
                  <Link to={`/product/${item._id}`}>
                    {item.name}
                  </Link>
                </h3>
                
                <p className="item-price">${item.price.toFixed(2)}</p>
                
                <div className="item-meta">
                  {item.category && (
                    <span className="item-category">{item.category}</span>
                  )}
                  {item.metal && (
                    <span className="item-metal">{item.metal}</span>
                  )}
                </div>
                
                <button 
                  className="btn-add-to-cart"
                  onClick={() => handleAddToCart(item._id)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage; 