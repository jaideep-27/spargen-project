const express = require('express');
const router = express.Router();
const upload = require('../utils/fileUpload');
const { protect, authorize } = require('../middlewares/auth.middleware');

// @desc    Upload single image
// @route   POST /api/upload/single
// @access  Private/Admin
router.post('/single', protect, authorize('admin'), upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }
    
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    
    res.status(200).json({
      success: true,
      data: {
        url: imageUrl,
        filename: req.file.filename
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
});

// @desc    Upload multiple images (up to 5)
// @route   POST /api/upload/multiple
// @access  Private/Admin
router.post('/multiple', protect, authorize('admin'), upload.array('images', 5), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }
    
    const uploadedFiles = req.files.map(file => {
      return {
        url: `${req.protocol}://${req.get('host')}/uploads/${file.filename}`,
        filename: file.filename
      };
    });
    
    res.status(200).json({
      success: true,
      data: uploadedFiles
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
});

module.exports = router; 