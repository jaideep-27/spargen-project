const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity cannot be less than 1'],
      default: 1
    },
    price: {
      type: Number,
      required: true
    }
  }],
  totalPrice: {
    type: Number,
    required: true,
    default: 0
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Pre-save middleware to calculate total price
cartSchema.pre('save', async function(next) {
  if (this.items && this.items.length > 0) {
    this.totalPrice = this.items.reduce((acc, item) => {
      return acc + (item.price * item.quantity);
    }, 0);
  } else {
    this.totalPrice = 0;
  }
  
  next();
});

module.exports = mongoose.model('Cart', cartSchema); 