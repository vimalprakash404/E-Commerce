const multer = require('multer');
const path = require('path');
const sharp = require('sharp');

// Allowed dimensions for e-commerce product images
const MIN_WIDTH = 400;
const MIN_HEIGHT = 400;
const MAX_WIDTH = 2000;
const MAX_HEIGHT = 2000;

// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../uploads/products'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname.replace(/\s+/g, '_'));
  }
});

// File filter for images only
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'));
  }
};

// Validate image dimensions after upload
const imageDimensionValidator = async (req, res, next) => {
  if (!req.files || req.files.length === 0) return next();

  try {
    for (const file of req.files) {
      const metadata = await sharp(file.path).metadata();
      if (
        metadata.width < MIN_WIDTH ||
        metadata.height < MIN_HEIGHT ||
        metadata.width > MAX_WIDTH ||
        metadata.height > MAX_HEIGHT
      ) {
        return res.status(400).json({
          error: `Image ${file.originalname} must be between ${MIN_WIDTH}x${MIN_HEIGHT} and ${MAX_WIDTH}x${MAX_HEIGHT} pixels.`,
        });
      }
    }
    next();
  } catch (err) {
    return res.status(400).json({ error: 'Invalid image file', details: err.message });
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB max per file
});

// Multer error handler middleware
const multerErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Handle Multer-specific errors
    let message = err.message;
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'File size too large. Maximum allowed is 5MB per image.';
    } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      message = 'Unexpected field. Please upload images using the "images" field.';
    }
    return res.status(400).json({ error: 'Image upload error', details: message });
  } else if (err) {
    // Handle other errors
    return res.status(400).json({ error: 'Image upload error', details: err.message });
  }
  next();
};

module.exports = { upload, imageDimensionValidator, multerErrorHandler };