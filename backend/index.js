require('dotenv').config()
const express = require("express");
const cors = require("cors");
const { connect } = require("./db");
const commonRouter = require("./routes/index");

const app = express();

connect();

app.use(cors());
app.use(express.json());

app.use("/api/v1", commonRouter);

app.use((error, req, res, next) => {
  res.status(422).json({
    success: false,
    message: error,
  });
});

app.listen(8001, () => {
  console.log("listening...");
});
