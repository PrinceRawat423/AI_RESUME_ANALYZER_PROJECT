const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn('MONGODB_URI is not set. Backend will start, but database features will not work.');
    return null;
  }

  await mongoose.connect(uri);
  console.log('MongoDB connected');
  return mongoose.connection;
}

module.exports = connectDB;
