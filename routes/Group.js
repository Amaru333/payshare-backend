const express = require("express");
const router = express.Router();

const controller = require("../controllers/groupController");
const verifyToken = require("../middlewares/verifyToken");

router.post("/", verifyToken, controller.createGroup);
router.get("/balances/:group", verifyToken, controller.getGroupSplitBalances);
router.get("/", verifyToken, controller.getGroupsContainingUser);
router.get("/count", verifyToken, controller.getGroupsContainingUserLength);
router.get("/id/:id", verifyToken, controller.getIndividualGroupDetails);

module.exports = router;
