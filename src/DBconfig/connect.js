const mongoose = require("mongoose");
require("dotenv").config();
const logger = require("../utils/logger");
const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URL}`, {
      serverSelectionTimeoutMS: 30000,
    });
    logger.info("DataBase connected succesfullby");
  } catch (err) {
    logger.error(err.message);
    logger.error("DB conection closed......");
    process.exit(1);
  }
};

module.exports = connectDB;
