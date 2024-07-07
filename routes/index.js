const express = require("express");
const router = express.Router();
const userRouter = require("./user.router");
const authRouter = require("./auth.router");
const organisationRouter = require("./organisation.router");

router.use("/api/users", userRouter);
router.use("/auth", authRouter);
router.use("/api/organisations", organisationRouter);

module.exports = router;
