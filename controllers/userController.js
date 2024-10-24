const jwt = require("jsonwebtoken");

const userModel = require("../models/userModel");

const { generateOTP } = require("../functions/generateOTP");
const { emailSender } = require("../functions/emailSender");

module.exports = {
  // Function to send OTP to user's mail ID
  sendOTP: async (req, res) => {
    const { email } = req.body;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) return res.status(400).json({ message: "Invalid email" });
    console.log(email);
    const OTP = generateOTP();
    try {
      const user = await userModel.findOne({ email });
      if (user) {
        user.previous_otp = OTP;
        await user.save();
      } else {
        await userModel.create({ email, previous_otp: OTP });
      }
      const sendOTP = emailSender(email, "OTP for verification", `<h1>Your OTP is: ${OTP}</h1>`);
      if (sendOTP) {
        res.status(200).json({ message: "OTP sent successfully" });
      } else {
        res.status(500).json({ message: "Error sending OTP, please try again later" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  },

  // Function to verify OTP and generate JWT token
  verifyOtp: async (req, res) => {
    const { email, otp } = req.body;
    try {
      const user = await userModel.findOne({ email });
      if (user) {
        if (user.previous_otp === otp) {
          const token = jwt.sign({ email, _id: user._id }, process.env.JWT_SECRET);
          const { previous_otp, ...userWithoutOTP } = user._doc;
          user.previous_otp = null;
          await user.save();
          res.status(200).header("auth-token", token).json(userWithoutOTP);
        } else {
          res.status(401).json({ message: "Invalid OTP" });
        }
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Function to update user details
  updateUser: async (req, res) => {
    const { full_name, username, phone_number, default_currency } = req.body;
    if (!full_name || !username || !phone_number || !default_currency) return res.status(400).json({ message: "All fields are required" });
    const user_id = req.user._id;
    try {
      const usernameExists = await userModel.findOne({ username });
      const currentUser = await userModel.findById(user_id);
      if (usernameExists && username !== currentUser.username) return res.status(400).json({ message: "Username already exists" });
      const updatedUser = await userModel.findByIdAndUpdate(user_id, { full_name, username, phone_number, default_currency }, { new: true });
      const { previous_otp, ...userWithoutOTP } = updatedUser._doc;
      res.status(200).json(userWithoutOTP);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  //Function to get the user's details
  getUser: async (req, res) => {
    const user_id = req.user._id;
    try {
      const user = await userModel.findById(user_id);
      const { previous_otp, ...userWithoutOTP } = user._doc;
      res.status(200).json(userWithoutOTP);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  //Function to get user by email or username
  getUserByEmailOrUsername: async (req, res) => {
    const { user } = req.params;
    try {
      const userData = await userModel.findOne({ $or: [{ email: user }, { username: user }] }).select("_id username");
      if (userData) {
        res.status(200).json(userData);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};
