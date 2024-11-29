const User = require("../models/userModel");
const jwt = require("jsonwebtoken");


module.exports = async function check_otpValidity ( req, res, next ) {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) return res.status(400).send("invalid email");

    if (!user?.otpCert)
      return res.status(401).send(" you are not authorised. go for authorisation");

    const Cert = user?.otpCert;

    let validOtpCert = jwt.verify(Cert, process.env.secretKey);

    if (!validOtpCert) return res.status(400).send("invalid otpCert");

    user.otpCert = null;
    await user.save();

    next();
  } catch (err) {
    console.log(err.message);
    next(err);
  }
};
