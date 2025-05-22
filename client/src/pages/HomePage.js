import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts, getTopProducts } from '../slices/productSlice';
import ProductGrid from '../components/products/ProductGrid';
import '../styles/HomePage.css';

const HomePage = () => {
  const dispatch = useDispatch();
  const { products, loading, error, topProducts } = useSelector((state) => state.product);

  useEffect(() => {
    // Fetch featured products
    dispatch(getProducts({ page: 1, sort: 'newest', limit: 8 }));
    
    // Fetch top rated products
    dispatch(getTopProducts());
  }, [dispatch]);

  // Categories with images and links - updated with Unsplash open-source images
  const categories = [
    {
      id: 'necklace',
      name: 'Necklaces',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      description: 'Elegant necklaces for every occasion'
    },
    {
      id: 'bracelet',
      name: 'Bracelets',
      image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      description: 'Beautiful bracelets to complement your style'
    },
    {
      id: 'earring',
      name: 'Earrings',
      image: 'https://images.unsplash.com/photo-1593795899768-947c4929449d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      description: 'Statement earrings that elevate any look'
    },
    {
      id: 'ring',
      name: 'Rings',
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      description: 'Stunning rings for special moments'
    }
  ];

  // Curated collections with Unsplash images
  const collections = [
    {
      id: 'summer',
      name: 'Summer Collection',
      image: 'https://images.unsplash.com/photo-1615655532388-0a6e7ab8364c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      description: 'Light and vibrant pieces for summer days'
    },
    {
      id: 'wedding',
      name: 'Wedding Collection',
      image: 'https://images.unsplash.com/photo-1587851411314-80ca7d584720?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      description: 'Elegant jewelry for your special day'
    }
  ];

  return (
    <div className="home-page">
      {/* Hero Section - Updated with better styling and Unsplash image */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="container">
          <div className="hero-content">
            <div className="hero-text-container">
              <h1 className="hero-title">Timeless Elegance For Every Occasion</h1>
              <p className="hero-description">
                Discover our exquisite collection of handcrafted jewelry designed to add a touch of
                sophistication to your everyday style and special moments.
              </p>
              <div className="hero-buttons">
                <Link to="/shop" className="hero-btn primary-btn neu-button neu-button-primary">
                  Shop Collection
                </Link>
                <Link to="/category/new-arrivals" className="hero-btn secondary-btn neu-button">
                  New Arrivals
                </Link>
              </div>
            </div>
            <div className="hero-image-container">
              <img 
                src="https://images.unsplash.com/photo-1684616289806-caa847f47f0e?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                alt="Luxury jewelry collection" 
                className="hero-image" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Banner */}
      <section className="featured-banner">
        <div className="container">
          <div className="featured-banner-content">
            <h2 className="featured-banner-title">Handcrafted with Passion</h2>
            <p className="featured-banner-text">
              Each piece in our collection is meticulously crafted by skilled artisans using the finest materials
            </p>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured Products</h2>
            <Link to="/shop" className="section-link">View All</Link>
          </div>
          <ProductGrid products={products} loading={loading} error={error} />
        </div>
      </section>

      {/* Curated Collections Section */}
      <section className="collections-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Curated Collections</h2>
          </div>
          <div className="collections-grid">
            {collections.map((collection) => (
              <Link
                to={`/category/${collection.id}`}
                className="collection-card"
                key={collection.id}
              >
                <div className="collection-image-container">
                  <img src={collection.image} alt={collection.name} className="collection-image" />
                  <div className="collection-overlay">
                    <div className="collection-content">
                      <h3 className="collection-title">{collection.name}</h3>
                      <p className="collection-description">{collection.description}</p>
                      <span className="collection-link">Shop Now</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Shop By Category</h2>
          </div>
          <div className="categories-grid">
            {categories.map((category) => (
              <Link
                to={`/category/${category.id}`}
                className="category-card neu-card"
                key={category.id}
              >
                <div className="category-image-container">
                  <img src={category.image} alt={category.name} className="category-image" />
                </div>
                <div className="category-content">
                  <h3 className="category-title">{category.name}</h3>
                  <p className="category-description">{category.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Top Rated Products */}
      {topProducts && topProducts.length > 0 && (
        <section className="top-rated-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Top Rated</h2>
              <Link to="/shop?sort=best-rated" className="section-link">View All</Link>
            </div>
            <ProductGrid products={topProducts} loading={false} error={null} />
          </div>
        </section>
      )}

      {/* Full-width Banner */}
      <section className="full-width-banner">
        <div className="container">
          <div className="banner-content">
            <h2 className="banner-title">Luxury Without Compromise</h2>
            <p className="banner-description">
              Ethically sourced materials and sustainable practices define our approach to luxury
            </p>
            <Link to="/about" className="banner-btn neu-button neu-button-primary">
              Our Story
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section - Updated with better icons and descriptions */}
      <section className="benefits-section">
        <div className="container">
          <div className="benefits-grid">
            <div className="benefit-card neu-card">
              <div className="benefit-icon">🚚</div>
              <h3 className="benefit-title">Free Shipping</h3>
              <p className="benefit-description">Complimentary shipping on all orders over $100</p>
            </div>
            <div className="benefit-card neu-card">
              <div className="benefit-icon">♻️</div>
              <h3 className="benefit-title">Easy Returns</h3>
              <p className="benefit-description">30-day hassle-free returns and exchanges</p>
            </div>
            <div className="benefit-card neu-card">
              <div className="benefit-icon">🔒</div>
              <h3 className="benefit-title">Secure Checkout</h3>
              <p className="benefit-description">Encrypted transactions for your peace of mind</p>
            </div>
            <div className="benefit-card neu-card">
              <div className="benefit-icon">💎</div>
              <h3 className="benefit-title">Quality Guarantee</h3>
              <p className="benefit-description">Certified authentic materials and craftsmanship</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section - Updated with improved styling */}
      <section className="newsletter-section neu-card">
        <div className="container">
          <div className="newsletter-content">
            <h2 className="newsletter-title">Join Our Community</h2>
            <p className="newsletter-description">
              Subscribe to receive exclusive offers, early access to new collections, and styling tips.
            </p>
            <form className="newsletter-form">
              <div className="newsletter-input-container">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="newsletter-input neu-input"
                  required
                />
                <button type="submit" className="newsletter-button neu-button neu-button-primary">
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 