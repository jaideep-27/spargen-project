/**
 * Utility functions for handling product images
 */

const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') }); // Load .env from project root

/**
 * Convert relative image paths to absolute URLs with the server domain
 * @param {string} imagePath - Relative image path
 * @returns {string} - Complete image URL
 */
const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  const clientBaseUrl = process.env.CLIENT_URL || 'http://localhost:3000';
  const serverBaseUrl = process.env.API_URL || `http://localhost:${process.env.PORT || 5000}`;

  if (imagePath.startsWith('/assets/')) {
    return `${clientBaseUrl}${imagePath}`;
  }
  
  if (imagePath.startsWith('/uploads/')) {
    return `${serverBaseUrl}${imagePath}`;
  }
  
  // Default case - assume it's a relative path in uploads, prefix with server base and /uploads/
  // Ensure double slashes are not introduced if imagePath might already have /uploads/
  if (imagePath.startsWith('/')) {
    return `${serverBaseUrl}/uploads${imagePath}`;
  } else {
    return `${serverBaseUrl}/uploads/${imagePath}`;
  }
};

/**
 * Process product image data for API responses
 * @param {Object} product - Product object
 * @returns {Object} - Product with processed image URLs
 */
const processProductImages = (product) => {
  if (!product) return product;
  
  // If it's a mongoose document, convert to plain object
  const productObj = product.toObject ? product.toObject() : {...product};
  
  // Process images array
  if (productObj.images && Array.isArray(productObj.images)) {
    productObj.images = productObj.images.map(image => ({
      ...image,
      url: getImageUrl(image.url)
    }));
  }
  
  return productObj;
};

/**
 * Process multiple products' image data for API responses
 * @param {Array} products - Array of product objects
 * @returns {Array} - Products with processed image URLs
 */
const processProductsImages = (products) => {
  if (!products || !Array.isArray(products)) return products;
  return products.map(product => processProductImages(product));
};

module.exports = {
  getImageUrl,
  processProductImages,
  processProductsImages
}; 