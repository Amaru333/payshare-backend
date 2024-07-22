const express = require("express");
const router = express.Router();

const controller = require("../controllers/currencyController");

router.get("/", controller.getAllCurrencies);

module.exports = router;
