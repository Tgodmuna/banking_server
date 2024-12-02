/** @typedef {import("express").RequestHandler} RequestHandler */ /**
 * Wraps an asynchronous function in a try-catch block to handle errors.
 *
 * @param {function} fn: - The asynchronous function to be wrapped.
 * @returns {function} - A new function that wraps the provided function in a try-catch block.
 */

const logger = require("../utils/logger");
module.exports = function tryCatchMW(fn) {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      logger.error(error);

      next(error);
    }
  };
};
