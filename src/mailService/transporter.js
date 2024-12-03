const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.mail.yahoo.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Verify the transporter
transporter.verify((err) => {
  if (err) {
    console.error("Error verifying transporter:", err);
  } else {
    console.log("Server is ready to take our messages");
  }
});

module.exports = transporter;
