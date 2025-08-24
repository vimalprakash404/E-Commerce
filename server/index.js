require('dotenv').config();
const express = require("express");
const cors = require("cors");
const http = require('http');
const socketIo = require('socket.io');


// connecting db 
require("./src/db/mongo")
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// CORS configuration
app.use(cors({
  origin: 'http://localhost:5173', // Vite dev server
  credentials: true
}));

app.use(express.json());
app.use(cors());
app.use("/api", require("./src/routers"));

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Make io available to routes
app.set('io', io);

// Socket.IO connection handling
require('./src/socket/socketHandler')(io);

server.listen(process.env.PORT || 5000, () =>
  console.log(`🚀 Server running on port ${process.env.PORT || 5000}`)
);

module.exports = { app, io };
