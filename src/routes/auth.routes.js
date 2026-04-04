
const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { authenticate } = require("../middleware/auth");
const { registerRules, loginRules, validate } = require("../validators/auth.validator");

router.post("/register", registerRules, validate, authController.register);
router.post("/login", loginRules, validate, authController.login);
router.get("/me", authenticate, authController.getProfile);

module.exports = router;