const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(
  cors({
    exposedHeaders: "auth-token",
  })
);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(process.env.PORT || 3004, () => {
      console.log("Server has started");
    });
  })
  .catch((err) => {
    console.log(err, "ERROR");
  });

const userRoutes = require("./routes/User");
app.use("/api/user", userRoutes);

const currencyRoutes = require("./routes/Currency");
app.use("/api/currency", currencyRoutes);

const groupRoutes = require("./routes/Group");
app.use("/api/group", groupRoutes);

const transactionRoutes = require("./routes/Transaction");
app.use("/api/transaction", transactionRoutes);
