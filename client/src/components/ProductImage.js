import React, { useState } from 'react';
import '../styles/ProductImage.css';

// Fallback image if the product image fails to load
const FALLBACK_IMAGE = '/assets/products/jewel1.avif';

/**
 * Component to display product images with proper error handling and loading states
 */
const ProductImage = ({ 
  image, 
  altText = 'Product Image',
  className = '',
  width = 'auto',
  height = 'auto'
}) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Determine the image URL to use
  const imageUrl = imageError ? FALLBACK_IMAGE : (
    typeof image === 'string' ? image : (image?.url || FALLBACK_IMAGE)
  );
  
  // Handle image loading errors
  const handleError = () => {
    setImageError(true);
    setIsLoading(false);
  };
  
  // Handle image loading completion
  const handleLoad = () => {
    setIsLoading(false);
  };
  
  return (
    <div className={`product-image-container ${className}`}>
      {isLoading && (
        <div className="product-image-loader">
          <div className="loader"></div>
        </div>
      )}
      <img
        src={imageUrl}
        alt={typeof image === 'string' ? altText : (image?.altText || altText)}
        className={`product-image ${isLoading ? 'loading' : ''}`}
        onError={handleError}
        onLoad={handleLoad}
        style={{ width, height }}
      />
    </div>
  );
};

export default ProductImage; 