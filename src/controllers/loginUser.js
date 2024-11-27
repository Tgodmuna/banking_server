const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const _ = require("lodash");

async function authController(body) {
  const userData = _.pick(body, ["email", "password"]);

  // Log the input data for debugging
  console.log("Attempting to authenticate:", userData);

  let user = await User.findOne({ email: userData.email });

  if (!user) {
    console.log("User not found");
    return null;
  }

  const decodedPassword = await bcrypt.compare(userData.password, user.password);

  if (!decodedPassword) {
    console.log("Password mismatch");
    return null;
  }

  const token = jwt.sign(
    _.pick(user, ["name", "email", "gender", "dateOfBirth", "address", "_id"]),
    process.env.secretKey
  );

  console.log("Authentication successful");
  return { user, token };
}

module.exports = authController;
