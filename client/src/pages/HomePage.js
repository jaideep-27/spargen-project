import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../slices/productSlice';
import { addToCart } from '../slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../slices/wishlistSlice';
import ProductGrid from '../components/products/ProductGrid';
import { getRandomCollectionImage, getRandomBannerImage } from '../utils/imageUtils'; 
import '../styles/HomePage.css';
import '../styles/FeaturedProducts.css';

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, loading, error } = useSelector((state) => state.product);
  const { wishlist } = useSelector((state) => state.wishlist);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    // Fetch featured products (mix of categories, high-rated, and on sale)
    dispatch(getProducts({ 
      limit: 8,
      sort: 'best-rated',
      minRating: 4,
      onSale: true
    }));
  }, [dispatch]);

  const handleAddToCart = async (product) => {
    if (!userInfo) {
      navigate('/login', { state: { from: '/' } });
      return;
    }

    try {
      await dispatch(addToCart({
        productId: product._id,
        quantity: 1
      })).unwrap();
    } catch (error) {
      console.error('Add to cart error:', error);
    }
  };

  const handleToggleWishlist = async (product) => {
    if (!userInfo) {
      navigate('/login', { state: { from: '/' } });
      return;
    }

    try {
      if (wishlist?.products?.some(item => item._id === product._id)) {
        await dispatch(removeFromWishlist(product._id)).unwrap();
      } else {
        await dispatch(addToWishlist(product._id)).unwrap();
      }
    } catch (error) {
      console.error('Wishlist toggle error:', error);
    }
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    if (email) {
      // Here you would typically make an API call to subscribe
      const successMessage = document.querySelector('.newsletter-success');
      if (successMessage) {
        successMessage.style.display = 'block';
        e.target.querySelector('input[type="email"]').value = '';
      }
    }
  };

  // Categories with images and links
  const categories = [
    {
      id: 'necklace',
      name: 'Necklaces',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=3087&auto=format&fit=crop',
      description: 'Elegant necklaces for every occasion'
    },
    {
      id: 'bracelet',
      name: 'Bracelets',
      image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=3270&auto=format&fit=crop',
      description: 'Beautiful bracelets to complement your style'
    },
    {
      id: 'earring',
      name: 'Earrings',
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=3270&auto=format&fit=crop',
      description: 'Statement earrings that elevate any look'
    },
    {
      id: 'ring',
      name: 'Rings',
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=3270&auto=format&fit=crop',
      description: 'Stunning rings for special moments'
    }
  ];
  
  // Collections for the curated section
  const collections = [
    {
      id: 'new-arrivals',
      name: 'New Arrivals',
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=3270&auto=format&fit=crop',
      description: 'Discover our latest jewelry pieces',
      link: '/shop?sort=newest'
    },
    {
      id: 'bestsellers',
      name: 'Bestsellers',
      image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=3269&auto=format&fit=crop',
      description: 'Shop our most popular designs',
      link: '/shop?sort=best-rated'
    }
  ];
  
  // Banner content
  const promoBanner = {
    title: 'Summer Collection 2024',
    subtitle: 'Discover radiant pieces that capture the essence of summer',
    image: 'https://images.unsplash.com/photo-1576022162861-7955f5837f1f?q=80&w=3270&auto=format&fit=crop',
    ctaText: 'Shop the Collection',
    ctaLink: '/shop?category=new-arrivals'
  };
  

  return (
    <div className="homepage">
      {/* Hero Section - Reverted to original */}
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

      {/* Featured Products Section */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured Products</h2>
            <Link to="/shop" className="section-link">View All</Link>
          </div>
          {loading ? (
            <div className="loading-spinner-container">
              <div className="loading-spinner"></div>
            </div>
          ) : error ? (
            <div className="error-message">
              {error}
            </div>
          ) : products && products.length > 0 ? (
            <div className="product-grid">
              {products.map((product) => (
                <div key={product._id} className="product-card">
                  <div className="product-image-container">
                    <Link to={`/product/${product._id}`}>
                      <img 
                        src={product.images[0]?.url || getRandomCollectionImage(product.category)}
                        alt={product.name}
                        className="product-image"
                      />
                    </Link>
                    <div className="product-actions">
                      <button 
                        className={`product-action-btn ${wishlist?.products?.some(item => item._id === product._id) ? 'active' : ''}`}
                        onClick={() => handleToggleWishlist(product)}
                        aria-label="Add to wishlist"
                      >
                        <i className={`${wishlist?.products?.some(item => item._id === product._id) ? 'fas' : 'far'} fa-heart`}></i>
                      </button>
                      <button 
                        className="product-action-btn"
                        onClick={() => handleAddToCart(product)}
                        aria-label="Add to cart"
                      >
                        <i className="fas fa-shopping-cart"></i>
                      </button>
                      <Link 
                        to={`/product/${product._id}`}
                        className="product-action-btn"
                        aria-label="Quick view"
                      >
                        <i className="far fa-eye"></i>
                      </Link>
                    </div>
                  </div>
                  <div className="product-info">
                    <div className="product-category">{product.category}</div>
                    <h3 className="product-title">
                      <Link to={`/product/${product._id}`}>{product.name}</Link>
                    </h3>
                    <div className="product-price-container">
                      {product.onSale && product.salePrice > 0 ? (
                        <>
                          <span className="product-sale-price">${product.salePrice.toFixed(2)}</span>
                          <span className="product-regular-price">${product.price.toFixed(2)}</span>
                        </>
                      ) : (
                        <span className="product-sale-price">${product.price.toFixed(2)}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-products-message">
              No featured products available
            </div>
          )}
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
                to={collection.link}
                className="collection-card neu-card"
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

      {/* Full-width Banner */}
      <section 
        className="full-width-banner neu-banner"
        style={{ backgroundImage: `url(${promoBanner.image})` }}
      >
        <div className="banner-content">
          <h2 className="banner-title">{promoBanner.title}</h2>
          <p className="banner-subtitle">{promoBanner.subtitle}</p>
          <Link to={promoBanner.ctaLink} className="btn btn-secondary banner-cta">
            {promoBanner.ctaText}
          </Link>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="benefits-section">
        <div className="container">
          <div className="benefits-grid">
            <div className="benefit-card neu-card">
              <div className="benefit-icon">
                <img src="/assets/icons/shipping.svg" alt="Free Shipping" />
              </div>
              <h3 className="benefit-title">Free Shipping</h3>
              <p className="benefit-description">Complimentary shipping on all orders over $100</p>
            </div>
            <div className="benefit-card neu-card">
              <div className="benefit-icon">
                <img src="/assets/icons/returns.svg" alt="Easy Returns" />
              </div>
              <h3 className="benefit-title">Easy Returns</h3>
              <p className="benefit-description">30-day hassle-free returns and exchanges</p>
            </div>
            <div className="benefit-card neu-card">
              <div className="benefit-icon">
                <img src="/assets/icons/secure.svg" alt="Secure Checkout" />
              </div>
              <h3 className="benefit-title">Secure Checkout</h3>
              <p className="benefit-description">Encrypted transactions for your peace of mind</p>
            </div>
            <div className="benefit-card neu-card">
              <div className="benefit-icon">
                <img src="/assets/icons/quality.svg" alt="Quality Guarantee" />
              </div>
              <h3 className="benefit-title">Quality Guarantee</h3>
              <p className="benefit-description">Certified authentic materials and craftsmanship</p>
            </div>
          </div>
        </div>
      </section>

      {/* Subscribe Section */}
      <section className="subscribe-section">
        <div className="container">
          <form className="subscribe-form" onSubmit={handleSubscribe}>
                <input
                  type="email"
                  placeholder="Your email address"
              className="subscribe-input"
                  required
                />
            <button type="submit" className="subscribe-button">
              SUBSCRIBE
                </button>
            <div className="newsletter-success" style={{ display: 'none' }}>
              Thank you for subscribing!
              </div>
            </form>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 