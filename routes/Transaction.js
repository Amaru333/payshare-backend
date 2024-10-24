const express = require("express");
const router = express.Router();

const controller = require("../controllers/transactionController");
const verifyToken = require("../middlewares/verifyToken");

router.post("/", verifyToken, controller.newTransaction);
router.get("/:group", verifyToken, controller.getTransactionsByGroup);

module.exports = router;
