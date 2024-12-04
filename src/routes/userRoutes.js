// @ts-nocheck

const express = require("express");
const validateRegisterationMW = require("../middleware/registerationMW");
const registerUser = require("../controllers/registerUser");
const tryCatchMW = require("../middleware/tryCatchMW");
const authMW = require("../middleware/loginMW");
const authController = require("../controllers/loginUser");
const { getUserAccountDetails } = require("../controllers/AccountDetails");
const jwt = require("jsonwebtoken");
const config = require("config");
const userModel = require("../models/userModel");
const { transporter } = require("../mailService/transporter");
const sendEmail = require("../mailService/sendEmail");
const router = express.Router();
const Joi = require("joi");
const _ = require("lodash");
const errorMW = require("../middleware/errorMW");
const loginMW = require("../middleware/loginMW");
const OTPgen = require("../utils/OTPgen");
const Account = require("../models/accountModel");
const tokenGen = require("../utils/tokenGen");
const { AccountGen } = require("../utils/AccountGen");
const bcrypt = require("bcryptjs/dist/bcrypt");
const updatePasswordMW = require("../middleware/update-passwordMW");
const logger = require("../utils/logger");
const ejs = require("ejs");
const path = require("path");

//register user
router.post(
  "/register",
  validateRegisterationMW,
  tryCatchMW(async (req, res) => {
    const user = await registerUser(req.body);

    if (!user) {
      logger.error("error registering user");
      logger.info("failed to register user ...", user);
      res.status(501).send("error creating a user");
      return;
    }
    logger.info("finished registering user ");
    logger.info("attempting account number generating........");

    const generatedAcc = AccountGen();
    logger.info("finished generating account number !");

    logger.info("attempting to create account for the registered user....");
    //create account for the new user
    const account = await new Account({
      accountNumber: generatedAcc,
      owner: user._id,
      balance: 0,
      isActive: true,
    }).save();

    if (!account) logger.info("failed creating account for the user");
    logger.info("done creating account !");

    const token = tokenGen(_.pick(user, ["name", "email", "_id"]), process.env.secretKey, "2h");

    //send a header with a name "x-auth-token"
    res
      .header("x-auth-token", token)
      .status(201)
      .json({
        message: "User registered successfully",
        user: _.pick(user, [
          "name",
          "email",
          "address",
          "dateOfBirth",
          "phoneNumber",
          "gender",
          "role",
          "isActive",
          "isVerified",
          "profileImage",
          "_id",
          "securityQuestions",
        ]),
        accountDetails: account,
      });

    //send user an email with the new account details
    await sendEmail(
      user.email,
      "ACCOUNT DETAILS",
      `dear user, thanks for registering with us.
    find your account details below:
      AccountNumber:${generatedAcc}
    `
    );
    return;
  }),
  errorMW
);

//login user route
router.post(
  "/login",
  loginMW,
  tryCatchMW(async (req, res) => {
    const response = await authController(req.body);
    if (response === "User not found")
      return res.status(404).send("it seems like,you dont have account with us !");

    if (!response || !response.user) return res.status(404).send("invalid user name or password");

    const { user, token, accountDetails } = response;

    res
      .header("x-auth-token", token)
      .status(200)
      .json({ message: "login successful", user, accountDetails });

    req.user = user;

    return;
  }),
  errorMW
);

// Route: Request OTP
router.post(
  "/resetPassword",
  tryCatchMW(async (req, res) => {
    const { email } = req.body;

    if (!email) return res.status(400).send("Email is required");

    const user = await userModel.findOne({ email });

    if (!user) return res.status(404).send("No account with such email");

    const otp = OTPgen(6);
    const otpExpiration = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes

    user.otp = otp;
    user.otpExpiration = otpExpiration;

    await user.save();

    try {
      ejs.renderFile(
        path.join(__dirname, "../views/Otpmessage.ejs"),
        { user: user.name, otp: otp },
        async (err, html) => {
          if (err) {
            console.log("error sending mail", err);
            return;
          }

          await sendEmail(user.email, "OTP for Password Reset", html);

          logger.info("OTP send succesfully");
        }
      );

      return res.status(200).send("OTP sent successfully");
    } catch (err) {
      logger.error("Error sending email:", err.message);
      return res.status(500).send("Error sending OTP");
    }
  }),
  errorMW
);

// Route: Verify OTP
router.post(
  "/verifyOTP",
  tryCatchMW(async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) return res.status(400).send("Invalid request");

    const user = await userModel.findOne({ email });
    logger.info("found user to verify-OTP on");

    if (!user) return res.status(400).send("no such a user");

    if (user.otpExpiration < Date.now()) return res.status(400).send(" expired OTP");

    if (parseInt(user?.otp) !== parseInt(otp)) return res.status(400).send("invalid otp");
    logger.info("otp verified");
    logger.info("attempting to erase the OTP,otpExpiration,otpCert.....");
    // OTP verified, proceed
    user.otp = null;
    user.otpExpiration = null;
    user.otpCert = tokenGen({ otp }, process.env.secretKey, "5min");
    await user.save();
    logger.info("finally erased");
    return res.status(200).send("OTP verified successfully");
  }),
  errorMW
);

// Route: Update Password
router.put(
  "/update-password",
  updatePasswordMW,
  tryCatchMW(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).send("Invalid request");

    const schema = Joi.string().min(8).required();

    const { error } = schema.validate(password);
    if (error) return res.status(400).send(error.details[0].message);

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { new: true }
    );

    if (!user) return res.status(404).send("No user found");

    try {
      ejs.renderFile(
        path.join(__dirname, "../views/PasswordMsg.ejs"),
        { user: user.name },
        async (err, html) => {
          if (err) {
            console.log("error sending acknowledgment mail", err);
            retun;
          }
          await sendEmail(user.email, "Password Changed", html);
          logger.info("changed password");
        }
      );
      return res.status(200).send("Password changed successfully");
    } catch (err) {
      logger.error("Error sending email:", err.message);
      return res.status(500).send("Error notifying user about password change");
    }
  }),
  errorMW
);

module.exports = router;
