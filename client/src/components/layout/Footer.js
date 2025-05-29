import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaPinterest, FaPaypal, FaCcStripe, FaCcVisa, FaCcMastercard } from 'react-icons/fa';
import { SiRazorpay, SiPaytm } from 'react-icons/si';
import '../../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-column">
            <h3 className="footer-title">Swarnika</h3>
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
        </div>

        <div className="footer-bottom">
          <div className="payment-methods">
            <div className="payment-icons">
              <FaPaypal className="payment-icon" title="PayPal" />
              <FaCcStripe className="payment-icon" title="Stripe" />
              <SiRazorpay className="payment-icon" title="Razorpay" />
              <SiPaytm className="payment-icon" title="Paytm" />
              <FaCcVisa className="payment-icon" title="Visa" />
              <FaCcMastercard className="payment-icon" title="Mastercard" />
            </div>
          </div>
          <p className="copyright">
            &copy; {new Date().getFullYear()} Swarnika. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 