require('dotenv').config();
const express = require("express");
const cors = require("cors");
const http = require('http');
const socketIo = require('socket.io');
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const config = require('./src/config/config');

// ---------------------- DATABASE ---------------------- //
require("./src/db/mongo");

// ---------------------- APP & SERVER ---------------------- //
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // change to frontend URL in production
    methods: ["GET", "POST"]
  }
});

// ---------------------- MIDDLEWARE ---------------------- //
app.use(cors()); // Allow all origins (change for production)
app.use(express.json());

// Remove default referrer policy
app.use((req, res, next) => {
  res.setHeader('Referrer-Policy', 'no-referrer');
  next();
});

// ---------------------- ROUTERS ---------------------- //
app.use("/api", require("./src/routers"));

// ---------------------- FILE UPLOAD ---------------------- //
const uploadsDir = path.join(__dirname, "uploads");

// Ensure uploads folder exists
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  }
});

const upload = multer({ storage });

// Upload route
app.post("/upload", upload.single("file"), (req, res) => {
  res.json({
    message: "File uploaded successfully",
    file: {
      name: req.file.filename,
      url: `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
    }
  });
});

// List uploaded files
app.get("/uploads", (req, res) => {
  fs.readdir(uploadsDir, (err, files) => {
    if (err) return res.status(500).json({ error: "Unable to scan uploads directory" });
    res.json({
      files: files.map(file => ({
        name: file,
        url: `${req.protocol}://${req.get("host")}/uploads/${file}`
      }))
    });
  });
});

// Serve uploaded files
app.use('/uploads', express.static(uploadsDir));

// ---------------------- SOCKET.IO ---------------------- //
app.set('io', io);
require('./src/socket/socketHandler')(io);

// ---------------------- SPA FALLBACK ---------------------- //

app.use(express.static(path.join(__dirname, '../frontend/dist')));
app.use('/*\w', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// ---------------------- START SERVER ---------------------- //
server.listen(config.PORT, () => {
  console.log(`🚀 Server running on port ${config.PORT}`);
});

module.exports = { app, io };
