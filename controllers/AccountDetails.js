const Account = require("../models/accountModel");
const _ = require("lodash");

module.exports.getUserAccountDetails = async (user) => {
  const userId = user._Id;

  let isValidAccount = await Account.findOne({ owner: userId });
  if (!isValidAccount) return null;

  const Acctdetails = _.pick(isValidAccount, [
    "accountType",
    "currency",
    "balance",
    "accountNumber",
  ]);

  return Acctdetails;
};
