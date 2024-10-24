const mongoose = require("mongoose");

const userSchema = require("./userModel");

const groupSchema = new mongoose.Schema(
  {
    group_name: { type: String, required: true },
    currency: { type: String, required: true },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: userSchema,
        required: true,
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: userSchema,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Group", groupSchema);
