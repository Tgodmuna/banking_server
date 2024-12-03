// @ts-nocheck

const router = require("express").Router();
const express = require("express");
const User = require("../models/userModel");
const authorised = require("../middleware/authorizationMW");
const _ = require("lodash");
const Jwt = require("jsonwebtoken");
const tryCatchMW = require("../middleware/tryCatchMW");
const { error } = require("console");
const errorMW = require("../middleware/errorMW");
const uploadMW = require("../middleware/uploadMW");
const path = require("path");
const logger = require("../utils/logger");

//view profile
router.get(
  "/view-me",
  authorised,
  tryCatchMW(async (req, res) => {
    const user = Jwt.decode(req.header("x-auth-token"));

    if (!user) return res.status(500).send("internal server error");

    return res.status(200).json(user);
  }),
  errorMW
);

//update profile

router.put(
  "/update",
  authorised,
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
  }),
  errorMW
);

//upload profile picture
router.post(
  "/upload",
  authorised,
  uploadMW,
  tryCatchMW(async (err, req, res) => {
    logger.info("file uploaded successfully");
    const filePath = path.join(__dirname, "../../upload", req.file.filename);
    const decodedToken = Jwt.decode(req.header("x-auth-token"));

    //update the user profileImage path with the file path
    const user = User.findByIdAndUpdate(
      decodedToken._id,
      { profileImage: filePath },
      { new: true }
    );

    res.status(200).json({ message: " uploaded successfully", user });
  }),
  errorMW
);

router.get("/profilePic", (req, res) => {
  console.log(__dirname);
  const filename = req.query.file;

  const filepath = path.join(__dirname, "../../upload", filename);

  console.log(filepath);

  if (!filename) return res.status(400);

  res.sendFile(filepath, (err) => {
    if (err) {
      res.status(404).send("file not found");
      logger.error("could not send file to user", err);
      return;
    }
    // res.status(200).send("file send successfully");
    logger.info("file sent to the user");
    return;
  });
});

module.exports = router;
