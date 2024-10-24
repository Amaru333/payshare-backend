const groupSchema = require("../models/groupModel");
const transactionSchema = require("../models/transactionModel");
const userModel = require("../models/userModel");

module.exports = {
  createGroup: async (req, res) => {
    const { group_name, currency, members } = req.body;
    const createdBy = req.user._id;
    const newGroup = new groupSchema({
      group_name,
      currency,
      members,
      createdBy,
    });
    try {
      const savedGroup = await newGroup.save();
      res.status(201).json(savedGroup);
    } catch (err) {
      res.status(400).json({ message: err });
    }
  },
  getGroupsContainingUser: async (req, res) => {
    const user = req.user._id;
    try {
      const groups = await groupSchema
        .find({
          $or: [{ createdBy: user }, { members: user }],
        })
        .populate({
          path: "members",
          model: userModel,
          select: "-previous_otp",
        })
        .populate({
          path: "createdBy",
          model: userModel,
          select: "-previous_otp",
        })
        .exec();
      res.status(200).json(groups);
    } catch (err) {
      res.status(400).json({ message: err });
    }
  },
  getGroupsContainingUserLength: async (req, res) => {
    const user = req.user._id;
    try {
      const groupLength = await groupSchema
        .find({
          $or: [{ createdBy: user }, { members: user }],
        })
        .countDocuments();
      res.status(200).json(groupLength);
    } catch (err) {
      res.status(400).json({ message: err });
    }
  },
  getGroupSplitBalances: async (req, res) => {
    try {
      const { group } = req.params;
      const transactions = await transactionSchema
        .find({ group })
        .populate({
          path: "paid_by",
          select: "full_name username email _id",
          model: userModel,
        })
        .populate({
          path: "split.user",
          select: "full_name username email _id",
          model: userModel,
        });
      const splitBalances = [];
      transactions.forEach((transactionItem) => {
        const indexOfElement = splitBalances.findIndex((element) => element.user._id.toString() === transactionItem.paid_by._id.toString());
        if (indexOfElement === -1) {
          splitBalances.push({
            user: transactionItem.paid_by,
            amount: transactionItem.total_cost.toFixed(2),
          });
        } else {
          console.log(splitBalances[indexOfElement].amount, transactionItem.total_cost, "--------------------");
          splitBalances[indexOfElement].amount += transactionItem.total_cost;
        }
        transactionItem.split.forEach((splitItem) => {
          const indexOfElement = splitBalances.findIndex((element) => element.user._id.toString() === splitItem.user._id.toString());
          if (indexOfElement === -1) {
            splitBalances.push({
              user: splitItem.user,
              amount: -splitItem.amount.toFixed(2),
            });
          } else {
            splitBalances[indexOfElement].amount -= splitItem.amount;
          }
        });
      });
      splitBalances.forEach((splitItem) => {
        splitItem.amount = parseFloat(splitItem.amount.toFixed(2));
      });
      console.log(splitBalances, "---------------------");
      res.status(200).json(splitBalances);
    } catch (err) {
      res.status(400).json({ message: err });
    }
  },
  getIndividualGroupDetails: async (req, res) => {
    try {
      const { id } = req.params;
      console.log(id);
      const groupDetails = await groupSchema.findById(id).populate({
        path: "members",
        model: userModel,
        select: "-previous_otp",
      });
      res.status(200).json(groupDetails);
    } catch (err) {
      res.status(400).json({ message: err });
    }
  },
};
