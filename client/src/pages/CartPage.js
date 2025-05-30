import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { getCart, updateCartItemQuantity, removeFromCart } from '../slices/cartSlice';
import Alert from '../components/ui/Alert';
import '../styles/cart.css';

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems = [], loading, error, total } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getCart());
    } else {
      navigate('/login', { state: { from: '/cart' } });
    }
  }, [dispatch, isAuthenticated, navigate]);

  const handleQuantityChange = (productId, quantity) => {
    const item = cartItems.find(ci => (ci.product?._id || ci._id) === productId);
    if (item) {
        dispatch(updateCartItemQuantity({ 
            productId,
            quantity, 
            itemId: item.itemId || item._id
        }));
    }
  };

  const handleRemoveItem = (itemId) => {
    if (itemId) {
        dispatch(removeFromCart({ 
            itemId 
        }));
    } else {
        console.error("Cannot remove item: itemId is missing from cart item.");
        // Optionally, dispatch an error alert to the user
        // dispatch(setAlert({ type: 'error', message: 'Could not remove item. Please try again.'}));
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (error && !loading) return <Alert type="error" message={error} />;
  
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
            {cartItems.map((item) => {
              const product = item.product || item;
              let imageUrl = product.images && product.images.length > 0 ? product.images[0].url || product.images[0] : (product.image || 'placeholder.jpg');

              // Log the initial image path from product data
              // console.log(`Product: ${product.name}, Initial image path: ${product.images && product.images.length > 0 ? product.images[0].url || product.images[0] : product.image}`);

              // Prepend base URL if imageUrl is a relative path and not a placeholder
              if (imageUrl !== 'placeholder.jpg' && !imageUrl.startsWith('http')) {
                imageUrl = `http://localhost:5000${imageUrl.startsWith('/') ? imageUrl : '/' + imageUrl}`;
              }

              // Log the final imageUrl being used
              // console.log(`Product: ${product.name}, Final imageUrl: ${imageUrl}`);

              return (
                <div key={product._id} className="cart-item">
                  <div className="item-image">
                    <img 
                      src={imageUrl} 
                      alt={product.name}
                    />
                  </div>
                  
                  <div className="item-details">
                    <h3 className="item-name">
                      <Link to={`/product/${product._id}`}>
                        {product.name}
                      </Link>
                    </h3>
                    <p className="item-price">${product.price.toFixed(2)}</p>
                    {product.metal && (
                      <p className="item-meta">Metal: {product.metal}</p>
                    )}
                  </div>
                  
                  <div className="item-quantity">
                    <button 
                      className="quantity-btn"
                      onClick={() => handleQuantityChange(product._id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="quantity-value">{item.quantity}</span>
                    <button 
                      className="quantity-btn"
                      onClick={() => handleQuantityChange(product._id, item.quantity + 1)}
                      disabled={item.quantity >= 10}
                    >
                      +
                    </button>
                  </div>
                  
                  <div className="item-subtotal">
                    ${(product.price * item.quantity).toFixed(2)}
                  </div>
                  
                  <button 
                    className="btn-remove-item"
                    onClick={() => handleRemoveItem(item.itemId)}
                  >
                    &times;
                  </button>
                </div>
              );
            })}
          </div>
          
          <div className="cart-summary">
            <h2 className="summary-title">Order Summary</h2>
            
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>${typeof total === 'number' ? total.toFixed(2) : '0.00'}</span>
            </div>
            
            <div className="summary-row">
              <span>Shipping:</span>
              <span>Free</span>
            </div>
            
            <div className="summary-row total">
              <span>Total:</span>
              <span>${typeof total === 'number' ? total.toFixed(2) : '0.00'}</span>
            </div>
            
            <button 
              className="btn-checkout"
              onClick={handleCheckout}
              disabled={cartItems.length === 0}
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