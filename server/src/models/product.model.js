const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  salePrice: {
    type: Number,
    min: [0, 'Sale price cannot be negative'],
    default: 0
  },
  onSale: {
    type: Boolean,
    default: false
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    altText: String
  }],
  category: {
    type: String,
    required: [true, 'Product category is required'],
    enum: [
      'necklace', 
      'bracelet', 
      'earring', 
      'ring', 
      'pendant', 
      'anklet', 
      'watch', 
      'set', 
      'other'
    ]
  },
  metal: {
    type: String,
    enum: [
      'gold', 
      'silver', 
      'platinum', 
      'rose gold', 
      'white gold', 
      'titanium', 
      'stainless steel', 
      'mixed', 
      'other'
    ]
  },
  gemstone: {
    type: String,
    enum: [
      'diamond', 
      'ruby', 
      'emerald', 
      'sapphire', 
      'amethyst', 
      'pearl', 
      'opal', 
      'topaz', 
      'none', 
      'other'
    ]
  },
  weight: {
    type: Number,
    min: [0, 'Weight cannot be negative']
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number
  },
  stockQuantity: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock quantity cannot be negative'],
    default: 0
  },
  isAvailable: {
    type: Boolean,
    default: function() {
      return this.stockQuantity > 0;
    }
  },
  features: [String],
  careInstructions: String,
  warrantyInfo: String,
  tags: [String],
  rating: {
    average: {
      type: Number,
      min: [0, 'Rating cannot be less than 0'],
      max: [5, 'Rating cannot be more than 5'],
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Middleware to ensure isAvailable is set correctly
productSchema.pre('save', function(next) {
  this.isAvailable = this.stockQuantity > 0;
  next();
});

// Virtual property for display price
productSchema.virtual('displayPrice').get(function() {
  return this.onSale && this.salePrice > 0 ? this.salePrice : this.price;
});

module.exports = mongoose.model('Product', productSchema); 