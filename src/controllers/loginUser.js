const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const Account = require("../models/accountModel");
const tokenGen = require("../utils/tokenGen");
async function authController(body) {
  const userData = _.pick(body, ["email", "password"]);

  // Log the input data for debugging
  console.log("Attempting to authenticate:", userData);

  let user = await User.findOne({ email: userData.email }).select('-createdAt -updatedAt -deleteAccount')

  if (!user) {
    console.log("User not found");
    return "User not found";
  }

  //get the associated user account
  const id = user._id;
  const accountDetails = await Account.findOne({ owner: id }).select("-createdAt -updatedAt -timestamps");

  const decodedPassword = await bcrypt.compare(userData.password, user.password);

  if (!decodedPassword) {
    console.log("Password mismatch");
    return null;
  }

  const token = tokenGen(
    _.pick(user, ["name", "email", "gender", "dateOfBirth", "address", "_id"]),
    // @ts-ignore
    process.env.secretKey,
    "30min"
  );

  console.log("Authentication successful");
  return { user, token, accountDetails };
}

module.exports = authController;
