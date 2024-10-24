const transactionSchema = require("../models/transactionModel");
const userSchema = require("../models/userModel");

module.exports = {
  newTransaction: async (req, res) => {
    const { group, paid_by, transaction_name, total_cost, split, type } = req.body;
    const newTransaction = new transactionSchema({
      group,
      paid_by,
      transaction_name,
      total_cost,
      split,
      createdBy: req.user._id,
      type,
    });
    try {
      const savedTransaction = await newTransaction.save();
      const populatedTransaction = await transactionSchema
        .findById(savedTransaction._id)
        .populate({
          path: "createdBy",
          select: "full_name username email _id",
          model: userSchema,
        })
        .populate({
          path: "paid_by",
          select: "full_name username email _id",
          model: userSchema,
        })
        .populate({
          path: "split.user",
          select: "full_name username email _id",
          model: userSchema,
        })
        .exec();
      // const populatedSavedTransaction = await savedTransaction
      //   .populate({
      //     path: "createdBy",
      //     select: "full_name username email _id",
      //     model: userSchema,
      //   })
      // .populate({
      //   path: "paid_by",
      //   select: "full_name username email _id",
      //   model: userSchema,
      // })
      // .populate({
      //   path: "split.user",
      //   select: "full_name username email _id",
      //   model: userSchema,
      // });
      res.status(201).json(populatedTransaction);
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: err });
    }
  },
  getTransactionsByGroup: async (req, res) => {
    const { group } = req.params;
    try {
      const transactions = await transactionSchema
        .find({ group })
        .sort({ createdAt: -1 })
        .populate({
          path: "createdBy",
          select: "full_name username email _id",
          model: userSchema,
        })
        .populate({
          path: "paid_by",
          select: "full_name username email _id",
          model: userSchema,
        })
        .populate({
          path: "split.user",
          select: "full_name username email _id",
          model: userSchema,
        });
      res.status(200).json(transactions);
    } catch (err) {
      res.status(400).json({ message: err });
    }
  },
};
