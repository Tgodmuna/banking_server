const Transaction = require("../models/transactionModel");
module.exports = async function logTransaction(
  sender,
  recipient,
  amount,
  type,
  status,
  description
) {
  const transaction = new Transaction({
    senderAccount: sender,
    amount: amount,
    recipientAccount: recipient,
    transactionType: type,
    status: status,
    description: description ? description : "",
    
  });
  await transaction.save();
};
