import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getMyOrders } from '../slices/orderSlice';
import { FaShoppingBag, FaBox, FaTruck, FaCheck, FaExclamationTriangle } from 'react-icons/fa';
import Loader from '../components/ui/Loader';
import '../styles/OrdersPage.css';

const OrdersPage = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.orders);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    dispatch(getMyOrders());
  }, [dispatch]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'processing':
        return <FaShoppingBag className="status-icon processing" />;
      case 'shipped':
        return <FaTruck className="status-icon shipped" />;
      case 'delivered':
        return <FaCheck className="status-icon delivered" />;
      case 'cancelled':
        return <FaExclamationTriangle className="status-icon cancelled" />;
      default:
        return <FaBox className="status-icon" />;
    }
  };

  const getFormattedDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getFormattedPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const filteredOrders = activeFilter === 'all' 
    ? orders 
    : orders?.filter(order => order.status === activeFilter);

  return (
    <div className="orders-page">
      <div className="container">
        <h1 className="page-title">My Orders</h1>

        {loading ? (
          <Loader />
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : orders && orders.length > 0 ? (
          <>
            <div className="order-filters">
              <button 
                className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
                onClick={() => setActiveFilter('all')}
              >
                All Orders
              </button>
              <button 
                className={`filter-btn ${activeFilter === 'processing' ? 'active' : ''}`}
                onClick={() => setActiveFilter('processing')}
              >
                Processing
              </button>
              <button 
                className={`filter-btn ${activeFilter === 'shipped' ? 'active' : ''}`}
                onClick={() => setActiveFilter('shipped')}
              >
                Shipped
              </button>
              <button 
                className={`filter-btn ${activeFilter === 'delivered' ? 'active' : ''}`}
                onClick={() => setActiveFilter('delivered')}
              >
                Delivered
              </button>
            </div>

            <div className="orders-list">
              {filteredOrders && filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <div key={order._id} className="order-card neu-card">
                    <div className="order-header">
                      <div className="order-date">
                        Ordered on {getFormattedDate(order.createdAt)}
                      </div>
                      <div className={`order-status ${order.status}`}>
                        {getStatusIcon(order.status)}
                        <span>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                      </div>
                    </div>

                    <div className="order-items-preview">
                      {order.orderItems.slice(0, 3).map((item) => (
                        <div key={item._id} className="preview-item">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="item-image" 
                          />
                        </div>
                      ))}
                      {order.orderItems.length > 3 && (
                        <div className="more-items">
                          +{order.orderItems.length - 3} more
                        </div>
                      )}
                    </div>

                    <div className="order-footer">
                      <div className="order-total">
                        <span>Total:</span> 
                        <span className="total-amount">{getFormattedPrice(order.totalPrice)}</span>
                      </div>
                      <Link to={`/order-confirmation/${order._id}`} className="view-details-btn">
                        View Details
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-orders-message">
                  No {activeFilter === 'all' ? '' : activeFilter} orders found.
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="empty-orders">
            <FaShoppingBag className="empty-icon" />
            <h2>No orders yet</h2>
            <p>Looks like you haven't made any orders yet.</p>
            <Link to="/shop" className="shop-now-btn">
              Shop Now
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage; 