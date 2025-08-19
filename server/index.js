require('dotenv').config();
const express = require("express");


// connecting db 
require("./src/db/mongo")



const app = express();
app.use(express.json());
app.use("/api", require("./src/routers"));
app.listen(process.env.PORT || 5000, () =>
  console.log(`🚀 Server running on port ${process.env.PORT || 5000}`)
);

