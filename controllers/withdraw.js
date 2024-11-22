module.exports = async function (body, req, res) {
  const Account = require("../models/accountModel");

  const { accountNumber, amount } = body;
  const userId = req.user._id;

  const account = await Account.findOne({ owner: userId });
  if (!account) return res.status(404).send("no such an account");

  if (account.accountNumber !== accountNumber) {
    return res.status(400).send("Invalid account number");
  }
  if (account.balance < amount) {
    return res.status(400).send("Insufficient balance");
  }

  account.balance -= amount;
  await account.save();

  return account;
};
