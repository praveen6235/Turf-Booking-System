const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/turf_user');
    console.log(`MongoDB Connected (user-service): ${conn.connection.host}`);
  } catch (err) {
    console.error(`MongoDB Connection Error (user-service): ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
