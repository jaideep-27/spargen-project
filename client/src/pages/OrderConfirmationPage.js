import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getOrderDetails } from '../slices/orderSlice';
import Loader from '../components/ui/Loader';
import Alert from '../components/ui/Alert';
import '../styles/order-confirmation.css';

const OrderConfirmationPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { order, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    if (id) {
      dispatch(getOrderDetails(id));
    }
  }, [dispatch, id]);

  if (loading) return <Loader />;
  if (error) return <Alert type="error" message={error} />;
  if (!order) return <Alert type="error" message="Order not found" />;

  return (
    <div className="order-confirmation-container">
      <div className="confirmation-header">
        <div className="success-icon">✓</div>
        <h1>Order Confirmed!</h1>
        <p className="confirmation-message">
          Thank you for your purchase. Your order has been received and is being processed.
        </p>
        <p className="order-number">
          Order Number: <span>{order._id}</span>
        </p>
      </div>
      
      <div className="confirmation-details">
        <div className="order-details">
          <h2>Order Details</h2>
          
          <div className="order-info-grid">
            <div className="info-card">
              <h3>Order Date</h3>
              <p>{new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
            
            <div className="info-card">
              <h3>Payment Method</h3>
              <p>{order.paymentMethod}</p>
            </div>
            
            <div className="info-card">
              <h3>Shipping Address</h3>
              <p>
                {order.shippingInfo.firstName} {order.shippingInfo.lastName}<br />
                {order.shippingInfo.address}<br />
                {order.shippingInfo.city}, {order.shippingInfo.state} {order.shippingInfo.zipCode}<br />
                {order.shippingInfo.country}
              </p>
            </div>
            
            <div className="info-card">
              <h3>Order Status</h3>
              <p className={`status ${order.status.toLowerCase()}`}>
                {order.status}
              </p>
            </div>
          </div>
        </div>
        
        <div className="order-items">
          <h2>Items Ordered</h2>
          
          <div className="items-container">
            {order.items.map((item) => (
              <div key={item._id} className="order-item">
                <div className="item-image">
                  <img 
                    src={item.product.images[0]} 
                    alt={item.product.name}
                  />
                </div>
                
                <div className="item-details">
                  <h3 className="item-name">{item.product.name}</h3>
                  <p className="item-price">${item.price.toFixed(2)}</p>
                  <p className="item-quantity">Quantity: {item.quantity}</p>
                </div>
                
                <div className="item-total">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="order-summary">
          <h2>Order Summary</h2>
          
          <div className="summary-totals">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>
            
            <div className="summary-row">
              <span>Shipping:</span>
              <span>{order.shippingCost === 0 ? 'Free' : `$${order.shippingCost.toFixed(2)}`}</span>
            </div>
            
            <div className="summary-row">
              <span>Tax:</span>
              <span>${order.tax.toFixed(2)}</span>
            </div>
            
            <div className="summary-row total">
              <span>Total:</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="confirmation-footer">
        <p>
          We've sent a confirmation email to <strong>{order.shippingInfo.email}</strong> with the order details.
        </p>
        
        <div className="action-buttons">
          <Link to="/shop" className="btn-continue-shopping">
            Continue Shopping
          </Link>
          
          <Link to="/account/orders" className="btn-view-all-orders">
            View All Orders
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage; 