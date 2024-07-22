const express = require("express");
const router = express.Router();

const controller = require("../controllers/userController");
const verifyToken = require("../middlewares/verifyToken");

router.post("/send-otp", controller.sendOTP);
router.post("/verify-otp", controller.verifyOtp);
router.put("/", verifyToken, controller.updateUser);
router.get("/", verifyToken, controller.getUser);
router.get("/find-user/:user", verifyToken, controller.getUserByEmailOrUsername);

module.exports = router;
