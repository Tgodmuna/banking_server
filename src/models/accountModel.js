const { required, ref } = require("joi");
const mongoose = require("mongoose");
const { type } = require("os");
const Schema = mongoose.Schema;

const accountSchema = new Schema(
  {
    accountNumber: {
      type: Number,
      required: true,
      unique: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    balance: {
      type: Number,
      required: true,
      min: [0, "Balance cannot be negative"],
      default: 0,
    },
    accountType: {
      type: String,
      enum: ["savings", "current"],
      default: "savings",
    },
    currency: {
      type: String,
      enum: ["NGN", "USD", "EUR"],
      default: "NGN",
    },

    isActive: {
      type: Boolean,
      default: true,
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

module.exports = mongoose.model("Account", accountSchema);
