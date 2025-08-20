const jwt = require('jsonwebtoken');
const User = require('../models/user');

class AuthMiddleware {
  // JWT authentication middleware
   async isAuthenticated(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      req.user = user;
      next();
    } catch (err) {
      res.status(401).json({ error: 'Invalid or expired token' });
    }
  }

  // Admin role check using user model
   isAdmin(req, res, next) {
    if (
      req.user &&
      Array.isArray(req.user.roles) &&
      req.user.roles.includes('admin')
    ) {
      return next();
    }
    res.status(403).json({ error: 'Forbidden' });
  }

   isCustomer(req, res, next) {
    if (
      req.user &&
      Array.isArray(req.user.roles) &&
      req.user.roles.includes('customer')
    ) {
      return next();
    }
    res.status(403).json({ error: 'Forbidden' });
  }


}

module.exports = new AuthMiddleware();