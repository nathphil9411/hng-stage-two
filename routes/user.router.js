const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/authenticate");
const userController = require("../controllers/user.controller");

router.get("/:id", authenticate, userController.getUserById);


module.exports = router;
