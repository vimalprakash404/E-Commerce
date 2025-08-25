const config = {
  // Server Configuration
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Database Configuration
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce',
  
  // JWT Configuration
  JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret_key_change_in_production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  
  // CORS Configuration
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
  
  // File Upload Configuration
  UPLOAD_PATH: process.env.UPLOAD_PATH || './uploads',
  MAX_FILE_SIZE: process.env.MAX_FILE_SIZE || 5 * 1024 * 1024, // 5MB
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
  
  // Image Dimensions
  MIN_IMAGE_WIDTH: 400,
  MIN_IMAGE_HEIGHT: 400,
  MAX_IMAGE_WIDTH: 2000,
  MAX_IMAGE_HEIGHT: 2000,
  
  // Pagination
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  
  // Admin Configuration
  DEFAULT_ADMIN: {
    email: 'admin@ecommerce.com',
    password: 'Admin@123',
    firstName: 'Admin',
    lastName: 'User',
    roles: ['admin']
  },
  
  // Sample Customer
  DEFAULT_CUSTOMER: {
    email: 'customer@ecommerce.com',
    password: 'Customer@123',
    firstName: 'John',
    lastName: 'Doe',
    roles: ['customer']
  }
};

module.exports = config;