require('dotenv').config();
const express = require("express");
const cors = require("cors");


// connecting db 
require("./src/db/mongo")



const app = express();

// CORS configuration
app.use(cors({
  origin: 'http://localhost:5173', // Vite dev server
  credentials: true
}));

app.use(express.json());
app.use("/api", require("./src/routers"));

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

app.listen(process.env.PORT || 5000, () =>
  console.log(`🚀 Server running on port ${process.env.PORT || 5000}`)
);

