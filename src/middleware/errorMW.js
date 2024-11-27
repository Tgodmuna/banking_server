module.exports = function ErrorMW(err, req, res, next) {
  // Log the error message and stack trace for debugging
  console.error("Error Message: ", err.message);
  console.error("Error Stack: ", err.stack);

  // Send a detailed response to the client
  res.status(500).send({
    errorMessage: err.message,
  });
};
