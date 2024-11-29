const Joi = require("joi");
const Account = require("../models/accountModel");

/**
 * Middleware function to handle transfer requests.
 * Validates the request body, checks the existence of sender and recipient accounts,
 * and passes the request to the next middleware if all validations pass.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - Resolves when the middleware function completes.
 */
module.exports = async function transferMW(req, res, next) {
  const { senderAccountNumber, recipientAccountNumber, amount, description } = req.body;

  const isValid = Joi.object({
    senderAccountNumber: Joi.number().min(10).max(10).required(),
    recipientAccountNumber: Joi.number().min(10).max(10).required(),
    amount: Joi.number().min(100).required(),
    description: Joi.string().allow(null, ""),
  }).validate(req.body);

  if (isValid.error) {
    return res.status(400).json({ message: isValid.error.details[0].message });
  }
  const senderAccount = await Account.findOne({ accountNumber: senderAccountNumber });
  const recipientAccount = await Account.findOne({ accountNumber: recipientAccountNumber });

  if (!senderAccount) {
    return res.status(400).json({ message: "Invalid sender account number" });
  }
  if (!recipientAccount) {
    return res.status(400).json({ message: "Invalid recipient account number" });
  }
  next();
};
