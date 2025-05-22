import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaPinterest, FaEnvelope } from 'react-icons/fa';
import '../../styles/Footer.css';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim() && email.includes('@')) {
      // TODO: Implement newsletter API call
      console.log('Subscribe with:', email);
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-column">
            <h3 className="footer-title">GlimmerGem</h3>
            <p className="footer-description">
              Exquisite handcrafted jewelry for every occasion.
              From timeless classics to modern designs.
            </p>
            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <FaFacebook />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <FaTwitter />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <FaInstagram />
              </a>
              <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <FaPinterest />
              </a>
            </div>
          </div>

          <div className="footer-column">
            <h3 className="footer-title">Shop</h3>
            <ul className="footer-links">
              <li><Link to="/shop">All Jewelry</Link></li>
              <li><Link to="/category/necklace">Necklaces</Link></li>
              <li><Link to="/category/bracelet">Bracelets</Link></li>
              <li><Link to="/category/earring">Earrings</Link></li>
              <li><Link to="/category/ring">Rings</Link></li>
              <li><Link to="/category/watch">Watches</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3 className="footer-title">Information</h3>
            <ul className="footer-links">
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/shipping">Shipping & Returns</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms & Conditions</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3 className="footer-title">Newsletter</h3>
            <p className="newsletter-text">
              Subscribe to our newsletter for exclusive offers and updates.
            </p>
            <form onSubmit={handleSubscribe} className="newsletter-form">
              <div className="newsletter-input-group">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="newsletter-input neu-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit" className="newsletter-button neu-button">
                  <FaEnvelope />
                </button>
              </div>
              {subscribed && (
                <p className="newsletter-success">Thank you for subscribing!</p>
              )}
            </form>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="payment-methods">
            <img src="/payment-methods.png" alt="Payment methods" />
          </div>
          <p className="copyright">
            &copy; {new Date().getFullYear()} GlimmerGem. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 