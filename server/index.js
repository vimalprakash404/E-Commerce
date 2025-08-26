require('dotenv').config();
const express = require("express");
const cors = require("cors");
const http = require('http');
const socketIo = require('socket.io');
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const config = require('./src/config/config');

// connecting db 
require("./src/db/mongo")

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: config.CORS_ORIGIN,
    methods: ["GET", "POST"]
  }
});

// CORS configuration
app.use(cors({
  origin: config.CORS_ORIGIN,
  credentials: true
}));

app.use((req, res, next) => {
  res.setHeader('Referrer-Policy', 'no-referrer'); // or "" for empty
  next();
});

app.use(express.json());
app.use(cors());
app.use("/api", require("./src/routers"));

// ---------------------- FILE UPLOAD HANDLING ---------------------- //

// Storage config for multer



// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Route: upload a file


// Route: list uploaded files
app.get("/uploads", (req, res) => {
  const uploadsDir = path.join(__dirname, "uploads");
  fs.readdir(uploadsDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: "Unable to scan uploads directory" });
    }
    res.json({
      files: files.map(file => ({
        name: file,
        url: `${req.protocol}://${req.get("host")}/uploads/${file}`
      }))
    });
  });
});

// ---------------------- SOCKET.IO ---------------------- //

// Make io available to routes
app.set('io', io);

// Socket.IO connection handling
require('./src/socket/socketHandler')(io);

// ---------------------- START SERVER ---------------------- //

server.listen(config.PORT, () =>
  console.log(`🚀 Server running on port ${config.PORT}`)
);

module.exports = { app, io };
