import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { getCart, updateCartItemQuantity, removeFromCart } from '../slices/cartSlice';
import Loader from '../components/ui/Loader';
import Alert from '../components/ui/Alert';
import '../styles/cart.css';

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems, loading, error, total } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getCart());
    } else {
      navigate('/login', { state: { from: '/cart' } });
    }
  }, [dispatch, isAuthenticated, navigate]);

  const handleQuantityChange = (productId, quantity) => {
    if (quantity > 0 && quantity <= 10) {
      dispatch(updateCartItemQuantity({ productId, quantity }));
    }
  };

  const handleRemoveItem = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (loading) return <Loader />;
  if (error) return <Alert type="error" message={error} />;
  
  return (
    <div className="cart-container">
      <h1 className="cart-title">Your Shopping Cart</h1>
      
      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty.</p>
          <Link to="/shop" className="btn-continue-shopping">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.product._id} className="cart-item">
                <div className="item-image">
                  <img 
                    src={item.product.images[0]} 
                    alt={item.product.name}
                  />
                </div>
                
                <div className="item-details">
                  <h3 className="item-name">
                    <Link to={`/product/${item.product._id}`}>
                      {item.product.name}
                    </Link>
                  </h3>
                  
                  <p className="item-price">${item.product.price.toFixed(2)}</p>
                  
                  {item.product.metal && (
                    <p className="item-meta">Metal: {item.product.metal}</p>
                  )}
                </div>
                
                <div className="item-quantity">
                  <button 
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span className="quantity-value">{item.quantity}</span>
                  <button 
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                    disabled={item.quantity >= 10}
                  >
                    +
                  </button>
                </div>
                
                <div className="item-subtotal">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </div>
                
                <button 
                  className="btn-remove-item"
                  onClick={() => handleRemoveItem(item.product._id)}
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
          
          <div className="cart-summary">
            <h2 className="summary-title">Order Summary</h2>
            
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>${total.toFixed(2)}</span>
            </div>
            
            <div className="summary-row">
              <span>Shipping:</span>
              <span>Free</span>
            </div>
            
            <div className="summary-row total">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
            
            <button 
              className="btn-checkout"
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </button>
            
            <Link to="/shop" className="btn-continue-shopping">
              Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage; 