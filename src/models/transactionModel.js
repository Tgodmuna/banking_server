const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const transactionSchema = new Schema(
  {
    senderAccount: {
      type: Number,
      validate: {
        validator: function (value) {
          // Require senderAccount only if transactionType is "transfer"
          // @ts-ignore
          if (this.transactionType === "transfer") {
            return value !== undefined && value !== null;
          }
          return true;
        },
        message: "Sender account is required for transfer transactions",
      },
    },
    recipientAccount: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [0, "Amount must be greater than zero"],
      validate: {
        validator: function (value) {
          return value > 0;
        },
        message: "Amount must be greater than zero",
      },
    },
    transactionType: {
      type: String,
      enum: ["deposit", "withdrawal", "transfer", "payment"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "reversed"],
      default: "pending",
    },
    description: {
      type: String,
      default: null,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Transaction", transactionSchema);
