require('dotenv').config();
const express = require("express");
const cors = require("cors");
const http = require('http');
const socketIo = require('socket.io');
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const config = require('./src/config/config');

// Connecting DB
require("./src/db/mongo");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // allow all origins (for testing)
    methods: ["GET", "POST"]
  }
});

// ---------------------- MIDDLEWARE ---------------------- //
app.use(cors());
app.use(express.json());

// Referrer-Policy: remove default behavior
app.use((req, res, next) => {
  res.setHeader('Referrer-Policy', 'no-referrer');
  next();
});

// ---------------------- ROUTERS ---------------------- //
app.use("/api", require("./src/routers"));

// ---------------------- FILE UPLOAD ---------------------- //
const uploadsDir = path.join(__dirname, "uploads");

// Ensure uploads folder exists
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
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
app.use('/uploads', express.static('uploads'));

// ---------------------- SOCKET.IO ---------------------- //
app.set('io', io);
require('./src/socket/socketHandler')(io);

// ---------------------- START SERVER ---------------------- //
server.listen(config.PORT, () =>
  console.log(`🚀 Server running on port ${config.PORT}`)
);

module.exports = { app, io };
