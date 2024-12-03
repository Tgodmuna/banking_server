// @ts-nocheck
const Account = require("../models/accountModel");
const _ = require("lodash");

/**
 * Retrieves the account details for the specified owner ID.
 *
 * @param {string} owner_id - The ID of the account owner.
 * @returns {Object|null} - The account details object, or null if the account is not found.
 */
module.exports.getUserAccountDetails = async (owner_id) => {
  let account = await Account.findOne({ owner: owner_id });
  if (!account) return null;

  const Acctdetails = _.pick(account, [
    "accountType",
    "currency",
    "balance",
    "accountNumber",
  ]);

  return Acctdetails;
};
