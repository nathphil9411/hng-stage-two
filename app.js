const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const router = require("./routes/index");
//const ErrorHandler = require("./middlewares/error_handler.middleware");

const app = express();

//middleware
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

//router
app.use(router);

//app.use(ErrorHandler);

app.all("*", (req, res, next) => {
  res.status(404).json({
    status: "Not Found",
    statusCode: 404,
    message: `${req.method} ${req.url} not found`
  });
});

module.exports = app;
