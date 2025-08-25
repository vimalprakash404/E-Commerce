const  mongoose = require('mongoose');
const config = require('../config/config');
const seeder = require('./seed');


// Connect to MongoDB
mongoose.connect(config.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(async () => {
    console.log('MongoDB Connected');
    
    // Run database seeding after connection
    if (config.NODE_ENV === 'development') {
        await seeder.seedAll();
    }
})
  .catch(err => console.error('MongoDB connection error:', err));
