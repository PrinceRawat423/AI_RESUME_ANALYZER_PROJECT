const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn('MONGODB_URI is not set. Starting in temporary demo mode; data will not persist after restart.');
    return null;
  }

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('MongoDB connected');
    return mongoose.connection;
  } catch (error) {
    console.warn(`MongoDB unavailable. Starting in temporary demo mode: ${error.message}`);
    return null;
  }
}

module.exports = connectDB;
