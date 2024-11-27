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
require("dotenv").config();

// import OTP from "../mailService/message.html";

//register user
router.post(
  "/register",
  validateRegisterationMW,
  tryCatchMW(async (req, res) => {
    const user = await registerUser(req.body);

    if (!user) return res.status(501).send("error creating a user");

    const payload = _.pick(user, ["name", "email", "_id"]);

    const token = jwt.sign(payload, process.env.secretKey, { expiresIn: "2h" });

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
      });
  }),
  errorMW
);

//login user route
router.post(
  "/login",
  loginMW,
  tryCatchMW(async (req, res) => {
    const response = await authController(req.body);
    if (!response || !response.user) return res.status(404).send("invalid user name or password");

    const { user, token } = response;

    res.header("x-auth-token", token).status(200).json({ message: "login successful", user });

    req.user = user;

    return;
  }),
  errorMW
);

//forgot password route
router
  .post(
    "/resetPassword",
    tryCatchMW(async (req, res) => {
      const user = userModel.find({ email: req.body.email });
      if (!user) return res.status(400).send("no account with such email");

      //if found,send otp
      const infor = await sendEmail(user.email, "OTP", require("../mailService/message.html"));
      if (!infor) return res.status(400).send("error sending otp");

      res.status(200).send("otp sent successfully");
    }),
    errorMW
  )
  .post(
    "/verifyOTP",
    tryCatchMW(async (req, res) => {
      const { email, otp } = req.body;
      const user = await userModel.findOne({ email });
      if (!user) return res.status(400).send("error verifying otp");
      if (OTP !== otp) return res.status(400).send("invalid otp");

      req.user = { email: user.email, otp };
      return;
    }),
    errorMW
  )
  .post(
    "/update-password",
    tryCatchMW(async (req, res) => {
      if (!req.user.otp) return res.status(401).send("unauthorized, apply for authentication");

      const { password } = req.body;

      const schema = Joi.object({
        password: Joi.string()
          .min(8)
          .required()
          .regex(/^[A-Z] /),
      }).validate(password);

      if (schema.error) return res.status(400).send(error.message);

      await userModel.findAndUpdate({ email: req.user.email }, { password: password });

      sendEmail(req.user.email, "PASSWORD CHANGED", require("../mailService/PasswordMsg.html"));

      return res.status(200).send("password changed successfully");
    }),
    errorMW
  );

module.exports = router;
