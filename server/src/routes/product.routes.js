const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');
const upload = require('../utils/fileUpload');

// @route   GET /api/products
// @desc    Get all products with filtering and pagination
// @access  Public
router.get('/', productController.getProducts);

// @route   GET /api/products/top
// @desc    Get top rated products
// @access  Public
router.get('/top', productController.getTopProducts);

// @route   GET /api/products/:id
// @desc    Get product by ID
// @access  Public
router.get('/:id', productController.getProductById);

// @route   POST /api/products
// @desc    Create a new product
// @access  Private/Admin
router.post(
  '/',
  protect,
  authorize('admin'),
  productController.createProduct
);

// @route   PUT /api/products/:id
// @desc    Update a product
// @access  Private/Admin
router.put(
  '/:id',
  protect,
  authorize('admin'),
  productController.updateProduct
);

// @route   DELETE /api/products/:id
// @desc    Delete a product
// @access  Private/Admin
router.delete(
  '/:id',
  protect,
  authorize('admin'),
  productController.deleteProduct
);

// @route   POST /api/products/:id/reviews
// @desc    Create product review
// @access  Private
router.post(
  '/:id/reviews',
  protect,
  productController.createProductReview
);

module.exports = router; 