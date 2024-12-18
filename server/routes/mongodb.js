const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGO_URI;

if (!uri) {
  throw new Error('MONGO_URI is not defined in your .env file');
}

// Create a cached connection to avoid multiple connections
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    console.log('Connecting to MongoDB using Mongoose...');
    cached.promise = mongoose
      .connect(uri) // Removed deprecated options
      .then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  console.log('Connected to MongoDB successfully');
  return cached.conn;
}

module.exports = connectToDatabase;
