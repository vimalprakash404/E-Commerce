require('dotenv').config();
const express = require("express");
const cors = require("cors");
const http = require('http');
const { Server } = require('socket.io'); // updated import for socket.io v4+
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const config = require('./src/config/config');

// Connect DB
require("./src/db/mongo");

const app = express();
const server = http.createServer(app);

// ---------------------- SOCKET.IO ---------------------- //
const io = new Server(server, {
  cors: {
    origin: "*",  // or your Vercel frontend URL
    methods: ["GET", "POST"]
  }
});

// Make io available in routes
app.set('io', io);

// Socket.IO connection handling
require('./src/socket/socketHandler')(io);

// ---------------------- MIDDLEWARE ---------------------- //
app.use(cors({
  origin: "*", // allow all origins, change to your frontend in production
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add this before your routes


// ---------------------- ROUTES ---------------------- //
app.use("/api", require("./src/routers"));

// ---------------------- FILE UPLOAD HANDLING ---------------------- //

// Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  }
});

const upload = multer({ storage });

// Route: upload a file
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  res.json({
    file: {
      name: req.file.filename,
      url: `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
    }
  });
});

// Route: list uploaded files
app.get("/uploads", (req, res) => {
  const uploadsDir = path.join(__dirname, "uploads");
  if (!fs.existsSync(uploadsDir)) return res.json({ files: [] });

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
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ---------------------- START SERVER ---------------------- //
server.listen(config.PORT, () =>
  console.log(`🚀 Server running on port ${config.PORT}`)
);

module.exports = { app, io };
