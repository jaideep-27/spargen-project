// Unsplash image collections for different categories
const unsplashImages = {
  // Jewelry category images
  jewelry: {
    necklaces: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f',
      'https://images.unsplash.com/photo-1602173574767-37ac01994b2a',
      'https://images.unsplash.com/photo-1599459183200-59c7687a0275'
    ],
    rings: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e',
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9',
      'https://images.unsplash.com/photo-1605101100278-5d1deb2b6498'
    ],
    earrings: [
      'https://images.unsplash.com/photo-1593795899768-947c4929449d',
      'https://images.unsplash.com/photo-1635767798638-3665960e9533',
      'https://images.unsplash.com/photo-1630019852942-f89202989a59'
    ],
    bracelets: [
      'https://images.unsplash.com/photo-1611652022419-a9419f74343d',
      'https://images.unsplash.com/photo-1573408301185-9146fe634ad0',
      'https://images.unsplash.com/photo-1602752275197-9d349bb87d87'
    ]
  },
  // Banner and promotional images
  banners: [
    'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0',
    'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338',
    'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93'
  ],
  // Collection images
  collections: [
    'https://images.unsplash.com/photo-1584302179602-e4c3d3fd629d',
    'https://images.unsplash.com/photo-1576723417715-6b408c988c23',
    'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584'
  ]
};

// Default image quality and size parameters
const defaultImageParams = {
  quality: 80,
  width: 800,
  format: 'webp'
};

/**
 * Get optimized Unsplash image URL with parameters
 * @param {string} baseUrl - Base Unsplash image URL
 * @param {Object} params - Image parameters (quality, width, format)
 * @returns {string} - Optimized image URL
 */
export const getOptimizedImageUrl = (baseUrl, params = {}) => {
  const { quality, width, format } = { ...defaultImageParams, ...params };
  return `${baseUrl}?q=${quality}&w=${width}&fm=${format}&fit=crop`;
};

/**
 * Get random image URL from a category
 * @param {string} category - Category name (necklaces, rings, etc.)
 * @param {Object} params - Image parameters
 * @returns {string} - Random image URL from the category
 */
export const getRandomCategoryImage = (category, params = {}) => {
  const categoryImages = unsplashImages.jewelry[category.toLowerCase()];
  if (!categoryImages || categoryImages.length === 0) {
    return getFallbackImage();
  }
  const randomIndex = Math.floor(Math.random() * categoryImages.length);
  return getOptimizedImageUrl(categoryImages[randomIndex], params);
};

/**
 * Get random banner image URL
 * @param {Object} params - Image parameters
 * @returns {string} - Random banner image URL
 */
export const getRandomBannerImage = (params = {}) => {
  const randomIndex = Math.floor(Math.random() * unsplashImages.banners.length);
  return getOptimizedImageUrl(unsplashImages.banners[randomIndex], params);
};

/**
 * Get random collection image URL
 * @param {Object} params - Image parameters
 * @returns {string} - Random collection image URL
 */
export const getRandomCollectionImage = (params = {}) => {
  const randomIndex = Math.floor(Math.random() * unsplashImages.collections.length);
  return getOptimizedImageUrl(unsplashImages.collections[randomIndex], params);
};

/**
 * Get fallback image URL
 * @returns {string} - Fallback image URL
 */
export const getFallbackImage = () => {
  return 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=800&fm=webp&fit=crop';
};

export default {
  getOptimizedImageUrl,
  getRandomCategoryImage,
  getRandomBannerImage,
  getRandomCollectionImage,
  getFallbackImage
}; 