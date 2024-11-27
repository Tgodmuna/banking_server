const { valid } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const transactionSchema = new Schema(
  {
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    senderAccount: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    recipientAccount: {
      type: Schema.Types.ObjectId,
      ref: "Account",
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
