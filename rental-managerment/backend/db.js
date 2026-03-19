require('dotenv').config(); // load biến môi trường từ file .env
const mongoose = require("mongoose");

const DB_URI = process.env.MONGO_URI; 

const connectDB = async () => {
  try {
    await mongoose.connect(DB_URI);
    console.log("MongoDB connected successfully!!!");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
