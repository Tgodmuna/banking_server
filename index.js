// @ts-nocheck
require("dotenv").config('./.env');
const express = require("express");
const connectDB = require("./src/DBconfig/connect");
const config = require("config");
const userRoutes = require("./src/routes/userRoutes");
const profileRoutes = require("./src/routes/profileRoutes");
const bankingRoutes = require("./src/routes/bankingRoutes");

const app = express();
connectDB();
//if no secret key for  token generation is found,
//automatically shutdown the app

if (!process.env.secretKey) {
  console.error("FATAL ERROR: secretKey is not defined.");
  process.exit(1);
}

app.use(express.json());
app.use("/api/user/", [userRoutes]);
app.use("/api/profile", [profileRoutes]);
app.use("/api/transactions", bankingRoutes);

const PORT = config.get("PORT") || 3000;

// console.log(config.get(JWTSecret));
// console.log(config.get(MONGO_URL));
// console.log(config.get(PORT));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
