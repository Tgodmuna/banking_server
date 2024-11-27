const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  console.log(process.env.MONGO_URL);
  try {
    await mongoose.connect(`${process.env.MONGO_URL}`, {
      serverSelectionTimeoutMS: 30000,
    });
    console.log("MongoDB connected...");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
