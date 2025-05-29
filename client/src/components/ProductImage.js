import React, { useState } from 'react';
import { getFallbackImage, getOptimizedImageUrl } from '../utils/imageUtils';
import '../styles/ProductImage.css';

/**
 * Component to display product images with proper error handling and loading states
 */
const ProductImage = ({ 
  image, 
  altText = 'Product Image',
  className = '',
  width = 'auto',
  height = 'auto',
  category = ''
}) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Determine the image URL to use
  const getImageUrl = () => {
    if (imageError) {
      return getFallbackImage();
    }
    
    if (typeof image === 'string') {
      return getOptimizedImageUrl(image, { width: parseInt(width) || 800 });
    }
    
    if (image?.url) {
      return getOptimizedImageUrl(image.url, { width: parseInt(width) || 800 });
    }
    
    return getFallbackImage();
  };
  
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
        src={getImageUrl()}
        alt={typeof image === 'string' ? altText : (image?.altText || altText)}
        className={`product-image ${isLoading ? 'loading' : ''}`}
        onError={handleError}
        onLoad={handleLoad}
        style={{ width, height }}
        loading="lazy"
      />
    </div>
  );
};

export default ProductImage; 