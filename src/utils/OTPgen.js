module.exports = function OTPgen(length) {
  var digits = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

  if (typeof length !== "number" || length <= 0) {
    throw new Error("Invalid length. Please provide a positive number.");
  }

  let OTP = "";
  for (let i = 0; i < length; i++) {
    // Appending a random digit to the OTP string.
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
};
