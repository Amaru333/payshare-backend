const mongoose = require("mongoose");

const userSchema = require("./userModel");
const groupSchema = require("./groupModel");

const transactionSchema = new mongoose.Schema(
  {
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: groupSchema,
      required: true,
    },
    transaction_name: { type: String, required: true },
    total_cost: { type: Number, required: true },
    paid_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: userSchema,
      required: true,
    },
    split: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: userSchema,
          required: true,
        },
        amount: { type: Number, required: true },
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: userSchema,
      required: true,
    },
    type: {
      type: String,
      enum: ["transaction", "settle"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Transaction", transactionSchema);
