const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    full_name: { type: String, required: false },
    username: { type: String, required: false },
    phone_number: { type: String, required: false },
    default_currency: { type: String, required: false },
    previous_otp: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
