// @ts-nocheck
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const { AccountGen } = require("../utils/AccountGen");

/**
 * Registers a new user in the system.
 *
 * @param {Object} body - The request body containing the user data.
 * @param {string} body.name - The name of the user.
 * @param {string} body.email - The email address of the user.
 * @param {string} body.password - The password of the user.
 * @param {string} body.dateOfBirth - The date of birth of the user.
 * @param {string} body.gender - The gender of the user.
 * @param {string} body.phoneNumber - The phone number of the user.
 * @param {string} body.address - The address of the user.
 * @param {string} body.role - The role of the user.
 * @param {boolean} body.isActive - Whether the user is active or not.
 * @param {boolean} body.isVerified - Whether the user is verified or not.
 * @param {boolean} body.deleteAccount - Whether the user's account should be deleted.
 * @param {string} body.profileImage - The URL of the user's profile image.
 * @param {Object} body.securityQuestions - The security questions and answers of the user.
 * @returns {Promise<User>} - The saved user instance.
 */

async function registerUser(body) {
  const userData = _.pick(body, [
    "name",
    "email",
    "password",
    "dateOfBirth",
    "gender",
    "phoneNumber",
    "address",
    "role",
    "isActive",
  ]);

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(userData.password, salt);
  userData.password = hashedPassword;

  const user = new User(userData);
  if (!user) return null;

  return await user.save();
}
module.exports = registerUser;
