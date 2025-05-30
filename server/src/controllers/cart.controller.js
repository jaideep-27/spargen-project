const Cart = require('../models/cart.model');
const Product = require('../models/product.model');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id })
      .populate({
        path: 'items.product',
        select: 'name images price salePrice onSale stockQuantity'
      });
      
    if (!cart) {
      // If cart doesn't exist, create a new empty cart
      cart = await Cart.create({ 
        user: req.user._id,
        items: [],
        totalPrice: 0
      });
    }
    
    res.json({
      success: true,
      data: cart
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      message: 'Server Error', 
      error: error.message 
    });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    
    // Validate product exists and is in stock
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }
    
    if (product.stockQuantity < quantity) {
      return res.status(400).json({ 
        success: false, 
        message: 'Not enough stock available' 
      });
    }
    
    // Get user cart or create a new one
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ 
        user: req.user._id,
        items: [],
        totalPrice: 0
      });
    }
    
    // Calculate price (honor sale price if product is on sale)
    const price = product.onSale && product.salePrice > 0 ? product.salePrice : product.price;
    
    // Check if product already in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );
    
    if (existingItemIndex > -1) {
      // Update quantity if product already in cart
      const existingItem = cart.items[existingItemIndex];
      const newQuantity = existingItem.quantity + quantity;
      
      // Check if new quantity exceeds available stock
      if (newQuantity > product.stockQuantity) {
        return res.status(400).json({ 
          success: false, 
          message: 'Requested quantity exceeds available stock' 
        });
      }
      
      cart.items[existingItemIndex].quantity = newQuantity;
    } else {
      // Add new item to cart
      cart.items.push({
        product: productId,
        quantity,
        price
      });
    }
    
    // Save cart
    await cart.save();
    
    // Return updated cart
    cart = await Cart.findOne({ user: req.user._id })
      .populate({
        path: 'items.product',
        select: 'name images price salePrice onSale stockQuantity'
      });
    
    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      message: 'Server Error', 
      error: error.message 
    });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:itemId
// @access  Private
exports.updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { itemId } = req.params;
    
    // Validate quantity
    if (!quantity || quantity < 1) {
      return res.status(400).json({ 
        success: false, 
        message: 'Quantity must be at least 1' 
      });
    }
    
    // Get user cart
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ 
        success: false, 
        message: 'Cart not found' 
      });
    }
    
    // Find the item in the cart
    const cartItem = cart.items.id(itemId);
    if (!cartItem) {
      return res.status(404).json({ 
        success: false, 
        message: 'Item not found in cart' 
      });
    }
    
    // Verify stock availability
    const product = await Product.findById(cartItem.product);
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }
    
    if (product.stockQuantity < quantity) {
      return res.status(400).json({ 
        success: false, 
        message: 'Not enough stock available' 
      });
    }
    
    // Update quantity
    cartItem.quantity = quantity;
    
    // Save cart
    await cart.save();
    
    // Return updated cart
    cart = await Cart.findOne({ user: req.user._id })
      .populate({
        path: 'items.product',
        select: 'name images price salePrice onSale stockQuantity'
      });
    
    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      message: 'Server Error', 
      error: error.message 
    });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
exports.removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;
    
    // Get user cart
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ 
        success: false, 
        message: 'Cart not found' 
      });
    }
    
    // Find the item in the cart to get its product ID for stock update (if needed later)
    const itemToRemove = cart.items.id(itemId);
    if (!itemToRemove) {
        return res.status(404).json({ success: false, message: 'Item not found in cart' });
    }
    // const productId = itemToRemove.product; // Keep this if you need to update stock upon removal

    // Remove item from cart using $pull
    cart.items.pull({ _id: itemId });
    
    // Save cart
    await cart.save();
    
    // Return updated cart
    cart = await Cart.findOne({ user: req.user._id })
      .populate({
        path: 'items.product',
        select: 'name images price salePrice onSale stockQuantity'
      });
    
    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      message: 'Server Error', 
      error: error.message 
    });
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
exports.clearCart = async (req, res) => {
  try {
    // Get user cart
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ 
        success: false, 
        message: 'Cart not found' 
      });
    }
    
    // Clear items
    cart.items = [];
    cart.totalPrice = 0;
    
    // Save cart
    await cart.save();
    
    res.status(200).json({
      success: true,
      message: 'Cart cleared',
      data: cart
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      message: 'Server Error', 
      error: error.message 
    });
  }
}; 