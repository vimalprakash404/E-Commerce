# E-Commerce Platform

A full-stack e-commerce application built with React.js and Node.js, featuring user authentication, product management, shopping cart functionality, and admin dashboard.

## Features Implemented

### User Features
- [x] User registration and authentication (JWT-based)
- [x] Product browsing with search and filtering
- [x] Product categories and category-based filtering
- [x] Product details with multiple image gallery
- [x] Shopping cart functionality (add, remove, update quantities)
- [x] Checkout process with billing information
- [x] Order placement and order history
- [x] User profile management
- [x] Responsive design for mobile and desktop

### Admin Features
- [x] Admin dashboard with statistics
- [x] Product management (CRUD operations)
- [x] Category management (CRUD operations)
- [x] Order management and status updates
- [x] Inventory management with stock tracking
- [x] Low stock alerts and notifications
- [x] Image upload for products and categories
- [x] Real-time notifications using Socket.IO

### Additional Features
- [x] Real-time updates using WebSocket
- [x] Image upload and management
- [x] Form validation (frontend and backend)
- [x] Error handling and user feedback
- [x] Search functionality
- [x] Price filtering and sorting
- [x] Stock management
- [x] Order status tracking

## Technology Stack

### Frontend
- **React.js** - UI library
- **React Router** - Client-side routing
- **Context API** - State management
- **Lucide React** - Icons
- **Vite** - Build tool and dev server

### Backend
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Socket.IO** - Real-time communication
- **Multer** - File upload handling
- **Sharp** - Image processing

### Additional Tools
- **CORS** - Cross-origin resource sharing
- **Express Validator** - Input validation
- **dotenv** - Environment variables
- **Node.js** - Runtime environment

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/vimalprakash404/E-Commerce.git
   cd E-Commerce
   ```

2. **Install Backend Dependencies**
   ```bash
   cd server
   npm i
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   npm i
   cd ../frontend
   npm install
   ```

### Environment Variables Setup

1. **Backend Environment Variables**
   Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/ecommerce
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRES_IN=7d
   CORS_ORIGIN=http://localhost:5173
   NODE_ENV=development
   ```

2. **Frontend Environment Variables**
   Create a `.env` file in the `frontend` directory:
   ```env
   VITE_API_BASE_URL=http://localhost:5000
   ```

### Configuration Setup

The server includes a configuration file (`server/src/config/config.js`) that manages all application settings. You can customize the following:

1. **Database Settings**
   - MongoDB connection string
   - Connection options

2. **Authentication Settings**
   - JWT secret key
   - Token expiration time

3. **File Upload Settings**
   - Maximum file size (default: 5MB)
   - Allowed file types
   - Image dimensions limits

4. **Default Accounts**
   - Admin credentials
   - Sample customer credentials

5. **Server Settings**
   - Port configuration
   - CORS origins
   - Pagination limits

### How to Run the Application

1. **Start MongoDB**
   ```bash
   # If using MongoDB locally
   mongod
   ```

2. **Start the Backend Server**
   ```bash
   cd server
   npm start
   # Server will run on http://localhost:5000
   ```

3. **Start the Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   # Frontend will run on http://localhost:5173
   ```

4. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000/api

## API Endpoints

### Authentication Routes
- `POST /api/user/auth/register` - User registration
- `POST /api/user/auth/login/customer` - Customer login
- `POST /api/user/auth/login/admin` - Admin login
- `POST /api/user/auth/logout` - User logout

### Product Routes
- `GET /api/product` - Get all products (with filtering)
- `GET /api/product/:id` - Get single product
- `POST /api/product` - Create product (Admin only)
- `PUT /api/product/:id` - Update product (Admin only)
- `DELETE /api/product/:id` - Delete product (Admin only)

### Category Routes
- `GET /api/category` - Get all categories
- `GET /api/category/:id` - Get single category
- `POST /api/category` - Create category (Admin only)
- `PUT /api/category/:id` - Update category (Admin only)
- `DELETE /api/category/:id` - Delete category (Admin only)

### Cart Routes
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add item to cart
- `POST /api/cart/remove` - Remove item from cart
- `POST /api/cart/clear` - Clear cart

### Order Routes
- `POST /api/order` - Place order
- `GET /api/order/users` - Get user orders
- `GET /api/order/admin` - Get all orders (Admin only)
- `PUT /api/order/:id` - Update order status (Admin only)

## Test Accounts

### Default Admin Account
- **Email**: admin@example.com
- **Password**: Admin@123
- **Role**: Admin

### Default Customer Account
- **Email**: customer@example.com
- **Password**: Customer@123
- **Role**: Customer

*Note: These are the default credentials defined in the config file. You can create additional accounts through the registration process.*

## Assumptions Made

### Technical Decisions
- **Authentication**: JWT tokens are stored in localStorage for simplicity
- **Image Storage**: Images are stored locally in the server's uploads directory
- **Database**: MongoDB is used without transactions for simplicity
- **Real-time Updates**: Socket.IO is used for admin notifications only
- **File Upload**: Maximum 5 images per product, 5MB per image limit
- **Pagination**: Basic pagination implemented for products

### Business Logic
- **Stock Management**: Stock is decremented when orders are placed
- **Order Status**: Orders start with "Pending" status
- **Cart Persistence**: Cart is tied to user account, not session
- **Price Display**: All prices are in Indian Rupees (₹)
- **Shipping**: Free shipping on all orders (simplified)
- **Tax Calculation**: Fixed 8% tax rate applied

### Limitations
- **Payment Integration**: No actual payment gateway integration
- **Email Notifications**: No email service integration
- **Image Optimization**: Basic image validation only
- **Search**: Simple text-based search implementation
- **Caching**: No caching mechanism implemented
- **Rate Limiting**: No API rate limiting implemented

## Project Structure

```
ecommerce-platform/
├── server/                 # Backend application
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── models/         # Database models
│   │   ├── routers/        # API routes
│   │   ├── middlewares/    # Custom middlewares
│   │   └── socket/         # Socket.IO handlers
│   ├── uploads/            # Uploaded images
│   └── index.js           # Server entry point
├── frontend/              # Frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── context/       # Context providers
│   │   ├── hooks/         # Custom hooks
│   │   └── services/      # API services
│   └── public/            # Static assets
└── README.md             # Project documentation
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.