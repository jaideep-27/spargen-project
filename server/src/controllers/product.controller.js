const Product = require('../models/product.model');
const { processProductImages, processProductsImages } = require('../utils/imageUtils');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
  try {
    const pageSize = 12;
    const page = Number(req.query.page) || 1;
    
    // Build query based on filters
    const query = {};
    
    // Category filter
    if (req.query.category) {
      query.category = req.query.category;
    }
    
    // Price range filter
    if (req.query.minPrice && req.query.maxPrice) {
      query.price = { 
        $gte: Number(req.query.minPrice), 
        $lte: Number(req.query.maxPrice) 
      };
    } else if (req.query.minPrice) {
      query.price = { $gte: Number(req.query.minPrice) };
    } else if (req.query.maxPrice) {
      query.price = { $lte: Number(req.query.maxPrice) };
    }
    
    // Metal filter
    if (req.query.metal) {
      query.metal = req.query.metal;
    }
    
    // Gemstone filter
    if (req.query.gemstone) {
      query.gemstone = req.query.gemstone;
    }
    
    // Search filter
    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
        { tags: { $in: [new RegExp(req.query.search, 'i')] } }
      ];
    }
    
    // Count documents for pagination
    const count = await Product.countDocuments(query);
    
    // Sorting
    let sortOptions = {};
    if (req.query.sort) {
      switch (req.query.sort) {
        case 'price-asc':
          sortOptions = { price: 1 };
          break;
        case 'price-desc':
          sortOptions = { price: -1 };
          break;
        case 'newest':
          sortOptions = { createdAt: -1 };
          break;
        case 'best-rated':
          sortOptions = { 'rating.average': -1 };
          break;
        default:
          sortOptions = { createdAt: -1 };
      }
    } else {
      sortOptions = { createdAt: -1 };
    }
    
    // Execute query with pagination
    const products = await Product.find(query)
      .sort(sortOptions)
      .limit(pageSize)
      .skip(pageSize * (page - 1));
    
    // Process product images
    const processedProducts = processProductsImages(products);
    
    res.json({
      success: true,
      data: {
        products: processedProducts,
        page,
        pages: Math.ceil(count / pageSize),
        total: count
      }
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

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (product) {
      // Process product images
      const processedProduct = processProductImages(product);
      
      res.json({
        success: true,
        data: processedProduct
      });
    } else {
      res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      message: 'Server Error', 
      error: error.message 
    });
  }
};

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      salePrice,
      onSale,
      category,
      metal,
      gemstone,
      weight,
      dimensions,
      stockQuantity,
      features,
      careInstructions,
      warrantyInfo,
      tags
    } = req.body;
    
    // Handle images (expecting an array of objects with url and altText)
    const images = req.body.images || [];
    
    // Create the product
    const product = await Product.create({
      name,
      description,
      price,
      salePrice,
      onSale,
      images,
      category,
      metal,
      gemstone,
      weight,
      dimensions,
      stockQuantity,
      features,
      careInstructions,
      warrantyInfo,
      tags
    });
    
    res.status(201).json({
      success: true,
      data: product
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

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }
    
    // Update product fields with request body data
    Object.keys(req.body).forEach(key => {
      // Handle special case for images to avoid overriding existing if empty
      if (key === 'images' && (!req.body.images || req.body.images.length === 0)) {
        return;
      }
      
      product[key] = req.body[key];
    });
    
    // Save the updated product
    const updatedProduct = await product.save();
    
    res.json({
      success: true,
      data: updatedProduct
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

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }
    
    await product.deleteOne();
    
    res.json({
      success: true,
      message: 'Product removed'
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

// @desc    Create a new review for a product
// @route   POST /api/products/:id/reviews
// @access  Private
exports.createProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }
    
    // Check if user already reviewed this product
    const alreadyReviewed = product.reviews.find(
      review => review.user.toString() === req.user._id.toString()
    );
    
    if (alreadyReviewed) {
      return res.status(400).json({ 
        success: false, 
        message: 'Product already reviewed' 
      });
    }
    
    // Create the review
    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment
    };
    
    // Add review to product
    product.reviews.push(review);
    
    // Update ratings
    product.rating.count = product.reviews.length;
    product.rating.average = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;
    
    // Save the product with the new review
    await product.save();
    
    res.status(201).json({
      success: true,
      message: 'Review added',
      data: {
        review: product.reviews[product.reviews.length -1],
        rating: product.rating
      }
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

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
exports.getTopProducts = async (req, res) => {
  try {
    // Get 6 top rated products
    const products = await Product.find({})
      .sort({ 'rating.average': -1 })
      .limit(6);
    
    // Process product images
    const processedProducts = processProductsImages(products);
    
    res.json({
      success: true,
      data: processedProducts
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