// @ts-nocheck

const express = require("express");
const validateRegisterationMW = require("../middleware/registerationMW");
const registerUser = require("../controllers/registerUser");
const tryCatchMW = require("../middleware/tryCatchMW");
const authMW = require("../middleware/authMW");
const authController = require("../controllers/loginUser");
const { getUserAccountDetails } = require("../controllers/AccountDetails");
const jwt = require("jsonwebtoken");
const config = require("config");
const router = express.Router();

//register user
router.post(
  "/register",
  validateRegisterationMW,
  tryCatchMW(async (req, res) => {
    const user = await registerUser(req.body);

    const token = jwt.sign(userData, secretKey, { expiresIn: "2h" });

    //send a header with a name "x-auth-token"
    res
      .header("x-auth-token", token)
      .status(201)
      .json({ message: "User registered successfully", user });
  })
);

//login user route
router.post(
  "/login",
  [authMW],
  tryCatchMW(async (req, res) => {
    //by now the req object has a verified user data,
    //which is gotten from decoded token  appended as 'req.user'
    //in req object

    const user = authController(req.body);
    if (!user) return res.status(404).send("invalid user name or password");

    const token = jwt.sign(user, config.get("secretKey"));

    res.header("x-auth-token", token).status(200).send({ message: "login successful", user });
    return;
  })
);


