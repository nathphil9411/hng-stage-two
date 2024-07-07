const express = require("express");

const {
  validate,
  registerSchema,
  loginSchema
} = require("../middlewares/validation");
const authController = require("../controllers/auth.controller");
const router = express.Router();

router.post("/register", validate(registerSchema), authController.registerUser);
router.post("/login", validate(loginSchema), authController.loginUser);

module.exports = router;
