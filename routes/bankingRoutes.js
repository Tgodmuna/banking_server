// @ts-nocheck
const express = require("express");
const router = express.Router();
const { getUserAccountDetails } = require("../controllers/AccountDetails");
const tryCatchMW = require("../middleware/tryCatchMW");
const authMW = require("../middleware/authMW");
const withdraw = require("../controllers/withdraw");
const transferMW = require("../middleware/transferMW");
const logTransactions = require("../utils/logTransactions");

//View Account Details
router.post(
  "/account details",
  [authMW],
  tryCatchMW(async (req, res) => {
    const Acctdetails = await getUserAccountDetails(req.user);
    //if @getUserAccountDetails() returns null, it indicates that the owner Id
    // used to select the account is invalid or not found.
    //in that case, it returns null.
    if (!Acctdetails) return res.status(404).send("no such an account ");

    return res.status(200).json({ message: "retrieved successfully", data: Acctdetails });
  })
);

//Deposit
router.post(
  "/deposit",
  [authMW],
  tryCatchMW(async (req, res) => {
    const { amount } = req.body;
    const userId = req.user._id;
    const account = await Account.findOne({ owner: userId });
    if (!account) return res.status(404).send("no such an account");

    account.balance += amount;
    await account.save();

    return res.status(200).json({ message: "deposited successfully", data: account });
  })
);

//Withdraw
router.post(
  "/withdraw",
  [authMW],
  tryCatchMW(async (req, res) => {
    const account = await withdraw(req.body, req, res);

    return res.status(200).json({ message: "withdrawal successful", data: account });
  })
);

//transfer
router.post(
  "/transfer",
  [authMW, transferMW],
  tryCatchMW(async (req, res) => {
    // Note: Account existence validations are handled in transferMW middleware

    const { recipientAccountNumber, amount, description } = req.body;
    const userId = req.user._id;
    const account = await Account.findOne({ owner: userId });
    const recipientAccount = await Account.findOne({ accountNumber: recipientAccountNumber });

    if (account.balance < amount) {
      return res.status(400).send("Insufficient balance");
    }
    account.balance -= amount;
    recipientAccount.balance += amount;

    //log transaction
    logTransactions(
      req.user.name,
      recipientAccount,
      amount,
      transfer,
      description ? description : ""
    );

    //save the both accounts
    await recipientAccount.save();
    await account.save();

    return res.status(200).json({ message: "transfer successful", data: account });
  })
);
