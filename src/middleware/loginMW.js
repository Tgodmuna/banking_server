const jwt = require("jsonwebtoken");
const config = require("config");
const joi = require("joi");
module.exports = (req, res, next) => {
  try {
    if (validateLoginData(req.body).error) {
      return res.status(400).json({ message: "Invalid data" });
    }
    next();
  } catch (error) {
    next(error);
    console.error(error);
  }
};

function validateLoginData(body) {
  const schema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(8).required(),
  });

  return schema.validate(body);
}
