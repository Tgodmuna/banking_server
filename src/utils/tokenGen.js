/**
 * Generates a JSON Web Token (JWT) with the provided payload, secret key, and expiration time.
 *
 * @param {Object} payload - The data to be encoded in the JWT.
 * @param {string} secretKey - The secret key used to sign the JWT.
 * @param {string} time - The expiration time for the JWT, in a format accepted by `jsonwebtoken.sign()`.
 * @returns {string} The generated JWT.
 */
module.exports = function TokenGen(payload, secretKey, time) {
  const jwt = require("jsonwebtoken");

  const token = jwt.sign(payload, secretKey, { expiresIn: time });

  return token;
};
