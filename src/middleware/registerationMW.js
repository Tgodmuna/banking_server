const Joi = require("joi");
const logger = require("../utils/logger");
/**
 * Middleware function that validates the registration data in the request body.
 * If the data is valid, it calls the next middleware function. If the data is
 * invalid, it returns a 400 Bad Request response with the error message.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
module.exports = (req, res, next) => {
  logger.info("inside validateRegisterationMW..... ");
  logger.info("attempting to validate user data...");

  const { error } = validateRegistrationData(req.body);

  if (error) {
    next(error);

    logger.error("failed validating user", error);
    // return res.status(400).json({ error: error.details[0].message });
  }

  logger.info("done validating user data...");

  next();
};

function validateRegistrationData(body) {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    dateOfBirth: Joi.date().required(),
    gender: Joi.string().valid("male", "female", "other").required(),
    phoneNumber: Joi.number().required(),
    address: Joi.object({
      street: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      postalCode: Joi.number().required(),
    }).required(),
    role: Joi.string().valid("admin", "user").required(),
  });

  return schema.validate(body);
}
