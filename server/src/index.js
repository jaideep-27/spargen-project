const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const dotenv = require('dotenv');

// Load env vars: Should be at the very top
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const userRoutes = require('./routes/user.routes');
const orderRoutes = require('./routes/order.routes');
const cartRoutes = require('./routes/cart.routes');
const wishlistRoutes = require('./routes/wishlist.routes');
const uploadRoutes = require('./routes/upload.routes');

const connectDB = require('./config/db.js'); // Assuming db.js exports with module.exports

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB (after dotenv.config())
connectDB();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? process.env.CLIENT_URL : 'http://localhost:3000', // Example: use env var for prod origin
  credentials: true,
  exposedHeaders: ['Content-Length', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api', limiter);

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/upload', uploadRoutes);

// --- Deployment: Serve static assets in production ---
if (process.env.NODE_ENV === 'production') {
  // Set static folder - client/build is two levels up from server/src
  app.use(express.static(path.join(__dirname, '../..', 'client/build')));

  // Catch-all route to serve index.html for any other request not handled by API routes
  app.get('*' , (req, res) => 
    res.sendFile(path.resolve(__dirname, '../..', 'client/build', 'index.html'))
  );
} else {
  // Development specific settings
  app.get('/', (req, res) => {
    res.send('API is running in development...');
  });
}
// --- End Deployment Logic ---

// Error handling middleware (should be after routes and production serving logic)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 