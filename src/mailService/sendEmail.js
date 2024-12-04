const transporter = require("./transporter");

module.exports = async function sendEmail(to, subject, message) {
  return transporter.sendMail({
    sender: "bankMailer@gmail.com",
    from: "tgodmuna@yahoo.com",
    to: to,
    subject: subject,
    html: message,
    priority: "high",
  });
};
