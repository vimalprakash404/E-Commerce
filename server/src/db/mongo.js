const  mongoose = require('mongoose');


const MONGO_URI = process.env.MONGO_URI;
// Connect to MongoDB
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB Connected'));
