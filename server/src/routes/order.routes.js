const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');

// @route   POST /api/orders
// @desc    Create a new order
// @access  Private
router.post('/', protect, orderController.createOrder);

// @route   GET /api/orders/myorders
// @desc    Get logged in user orders
// @access  Private
router.get('/myorders', protect, orderController.getMyOrders);

// @route   GET /api/orders/:id
// @desc    Get order by ID
// @access  Private
router.get('/:id', protect, orderController.getOrderById);

// @route   PUT /api/orders/:id/pay
// @desc    Update order to paid
// @access  Private
router.put('/:id/pay', protect, orderController.updateOrderToPaid);

// @route   GET /api/orders
// @desc    Get all orders
// @access  Private/Admin
router.get('/', protect, authorize('admin'), orderController.getOrders);

// @route   PUT /api/orders/:id/status
// @desc    Update order status
// @access  Private/Admin
router.put('/:id/status', protect, authorize('admin'), orderController.updateOrderStatus);

// @route   PUT /api/orders/:id/tracking
// @desc    Update order tracking info
// @access  Private/Admin
router.put('/:id/tracking', protect, authorize('admin'), orderController.updateOrderTracking);

module.exports = router; 