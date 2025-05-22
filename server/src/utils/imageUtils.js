/**
 * Utility functions for handling product images
 */

const path = require('path');
const fs = require('fs');

/**
 * Convert relative image paths to absolute URLs with the server domain
 * @param {string} imagePath - Relative image path
 * @returns {string} - Complete image URL
 */
const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // If image path already contains http/https, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // For assets from client
  if (imagePath.startsWith('/assets/')) {
    // Strip the leading slash and point to the client assets directory
    return `http://localhost:3000${imagePath}`;
  }
  
  // For server uploads
  if (imagePath.startsWith('/uploads/')) {
    // Point to the server uploads directory
    return `http://localhost:5001${imagePath}`;
  }
  
  // Default case - assume it's a relative path in uploads
  return `http://localhost:5001/uploads/${imagePath}`;
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