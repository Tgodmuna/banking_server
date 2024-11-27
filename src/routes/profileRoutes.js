// @ts-nocheck

const router = require("express").Router();
const User = require("../models/userModel");
const authMW = require("../middleware/loginMW");
const _ = require("lodash");
const tryCatchMW = require("../middleware/tryCatchMW");
const { error } = require("console");
require("dotenv").config();

//view profile
router.get(
  "/view-me",
  authMW,
  tryCatchMW(async (req, res) => {
    const user = _.pick(req.User, [
      "name",
      "email",
      "password",
      "dateOfBirth",
      "gender",
      "phoneNumber",
      "address",
      "isVerified",
      "profileImage",
    ]);

    return res.status(200).json(user);
  })
);

//update profile

router.put(
  "/update",
  authMW,
  tryCatchMW(async (req, res) => {
    const { payload } = req.body;
    if (payload === "picture") {
      let user = await User.findByIdAndUpdate(
        req.user._Id,
        { profileImage: req.body.image },
        { new: true }
      );
      if (!user) throw new Error();

      user.save();

      res.status(200).send("profile picture updated successfully");
      return;
    } else if (payload === "address") {
      let user = await User.findByIdAndUpdate(
        req.user._Id,
        { address: req.body.address },
        { new: true }
      );

      if (!user) throw new Error();

      user.save();

      res.status(200).send("address updated successfully");
      return;
    }
  })
);

//upload profile picture
router.post(
  "/upload",
  tryCatchMW(async (req, res) => {
    //profile upload
  })
);

module.exports = router;
