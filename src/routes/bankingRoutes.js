// @ts-nocheck
const express = require("express");
const router = express.Router();
const { getUserAccountDetails } = require("../controllers/AccountDetails");
const tryCatchMW = require("../middleware/tryCatchMW");
const authMW = require("../middleware/loginMW");
const withdraw = require("../controllers/withdraw");
const transferMW = require("../middleware/transferMW");
const logTransactions = require("../utils/logTransactions");
const sendEmail = require("../mailService/sendEmail");
const { log } = require("console");
const { populate } = require("dotenv");
const { findOne } = require("../models/userModel");
const authorizationMW = require("../middleware/authorizationMW");
const errorMW = require("../middleware/errorMW");
const jwt = require("jsonwebtoken");
const Account = require("../models/accountModel");
require("dotenv").config();

//View Account Details
router.get(
  "/account-details",
  [authorizationMW],
  tryCatchMW(async (req, res) => {
    const userId = req.user._id;
    const Acctdetails = await getUserAccountDetails(userId);

    if (!Acctdetails) return res.status(404).send("no such an account ");

    sendEmail(
      req.user.email,
      "Account Details",
      `Your Account Details ${{
        accountNumber: Acctdetails.accountNumber,
        balance: Acctdetails.balance,
        currency: Acctdetails.currency,
        accountType: Acctdetails.accountType,
      }}`
    );
    return res.status(200).json({ message: "retrieved successfully", data: Acctdetails });
  }),
  errorMW
);

//Deposit
// Deposit
router.post(
  "/deposit",
  [authorizationMW],
  tryCatchMW(async (req, res) => {
    const { amount, accountToCredit } = req.body;

    if (!amount || !accountToCredit) return res.status(406).send("Invalid input");

    const account = await Account.findOne({ accountNumber: accountToCredit }).populate("owner");
    if (!account) return res.status(404).send("No such account in this bank system");

    if (!account.isActive) return res.status(406).send("Account is not active");

    account.balance += parseInt(amount);
    await account.save();

    // Notify the user
    sendEmail(
      account.owner.email,
      "Deposit Notification",
      `Your account (${accountToCredit}) has been credited with ${amount} ${account.currency}.`
    );

    // Log the transaction
    await logTransactions(
      null, // No debiting account
      accountToCredit,
      amount,
      "deposit",
      "completed",
      "Funds added to account"
    );

    return res.status(200).json({ message: "Deposited successfully", data: account.balance });
  }),
  errorMW
);

//Withdraw
router.post(
  "/withdraw",
  [authMW],
  [authorizationMW],

  tryCatchMW(async (req, res) => {
    const account = await withdraw(req.body, req, res);

    return res.status(200).json({ message: "withdrawal successful", data: account });
  })
);

//transfer
router.post(
  "/transfer",
  [authorizationMW],
  tryCatchMW(async (req, res) => {
    const { amount, accountToDebitFrom, accountToCredit } = req.body;

    if (!amount || !accountToDebitFrom || !accountToCredit)
      return res.status(406).send("invalid input");

    const account = await Account.findOne({ accountNumber: accountToDebitFrom }).populate("owner");
    if (!account) return res.status(404).send("no such an account");

    const _accountToCredit = await Account.findOne({ accountNumber: accountToCredit }).populate(
      "owner"
    );

    if (!_accountToCredit) return res.status(404).send("no such an account in this bank system");

    if (account.balance < amount) return res.status(406).send("insufficient funds");
    if (account.currency !== _accountToCredit.currency)
      return res.status(406).send("currency mismatch");

    if (!account.isActive) return res.status(406).send("account is not active");

    _accountToCredit.balance += parseInt(amount);
    await _accountToCredit.save();
    sendEmail(
      _accountToCredit.owner.email,
      "Deposit",
      `Your Account has been credited with ${amount}  $_{accountToCredit.currency}. from ${accountToDebitFrom}`
    );

    account.balance -= amount;
    await account.save();
    const _email = account.owner.email;
    sendEmail(
      _email,
      "Deposit",
      `Your Account ${accountToDebitFrom} was debited with ${amount} to ${_accountToCredit.currency}`
    );

    await logTransactions(
      accountToDebitFrom,
      accountToCredit,
      amount,
      "deposit",
      "completed",
      "use it for upkeeps"
    );
    sendEmail(
      req.user.email,
      "CREEDIT",
      `Your Account has been credited with ${amount} ${account.currency}`
    );

    return res.status(200).json({ message: "deposited successfully", data: account.balance });
  }),
  errorMW
);

module.exports = router;
