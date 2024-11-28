const jwt = require("jsonwebtoken");
module.exports = function authorisationMW(req, res, next) {
  try {
    const token = req.header("x-auth-token");

    if (!token) return res.status(401).send("unauthorised,provide access token");

    const validToken = jwt.verify(token, process.env.secretKey);

    if (!validToken) return res.status(401).send("invalid token");

    next();
  } catch (err) {
    console.log(err);
    next(err);
  }
};
