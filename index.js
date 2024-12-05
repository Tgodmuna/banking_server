// @ts-nocheck
require("dotenv").config("./.env");
const express = require("express");
const connectDB = require("./src/DBconfig/connect");
const logger = require("./src/utils/logger");
const config = require("config");
const userRoutes = require("./src/routes/userRoutes");
const profileRoutes = require("./src/routes/profileRoutes");
const bankingRoutes = require("./src/routes/bankingRoutes");
const app = express();
connectDB();

//if no secret key for  token generation is found,
//automatically shutdown the app
if (!process.env.secretKey) {
  logger.error("FATAL ERROR: secretKey is not defined.");
  process.exit(1);
}
//handling uncaught exception
process.on("uncaughtExceptions", (ex) => {
  logger.error("caught an uncaughtExceptions,", ex.message);
  process.exit(1);
});

//handling unhandled exceptions
process.on("unhandledRejection", (ex) => {
  logger.error("unhandled rejection", ex.message, ex);
  process.exit(1);
});
app.use(express.json());
app.use("/api/user/", [userRoutes]);
app.use("/api/profile", [profileRoutes]);
app.use("/api/transactions", bankingRoutes);
app.set("view engine", "ejs");
app.set("views", "./src/views/");

const PORT = config.get("PORT") || 3000;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
