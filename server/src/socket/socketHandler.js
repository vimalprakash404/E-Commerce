const jwt = require('jsonwebtoken');
const User = require('../models/user');
const config = require('../config/config');

module.exports = (io) => {
  // Middleware for socket authentication
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }
      
      const decoded = jwt.verify(token, config.JWT_SECRET);
      const user = await User.findById(decoded.userId);
      
      if (!user) {
        return next(new Error('User not found'));
      }
      
      socket.user = user;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User ${socket.user.firstName} connected`);
    
    // Join admin room if user is admin
    if (socket.user.roles.includes('admin')) {
      socket.join('admin');
      console.log(`Admin ${socket.user.firstName} joined admin room`);
    }
    
    // Join customer room
    if (socket.user.roles.includes('customer')) {
      socket.join('customer');
      socket.join(`user_${socket.user._id}`);
    }

    socket.on('disconnect', () => {
      console.log(`User ${socket.user.firstName} disconnected`);
    });
  });

  // Helper functions to emit events
  const emitToAdmins = (event, data) => {
    io.to('admin').emit(event, data);
  };

  const emitToUser = (userId, event, data) => {
    io.to(`user_${userId}`).emit(event, data);
  };

  const emitToAll = (event, data) => {
    io.emit(event, data);
  };

  return { emitToAdmins, emitToUser, emitToAll };
};