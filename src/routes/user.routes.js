
const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");
const { authenticate, authorize } = require("../middleware/auth");
const {
  validate,
  createUserRules,
  updateUserRules,
  userIdRule,
} = require("../validators/user.validator");

// All user routes require login + admin role
router.use(authenticate, authorize("admin"));

// GET /api/users?page=1&limit=10&role=viewer&status=active
router.get("/", userController.getAllUsers);

// GET /api/users/:id
router.get("/:id", userIdRule, validate, userController.getUserById);

// POST /api/users
router.post("/", createUserRules, validate, userController.createUser);

// PUT /api/users/:id
router.put("/:id", updateUserRules, validate, userController.updateUser);

// DELETE /api/users/:id
router.delete("/:id", userIdRule, validate, userController.deleteUser);

module.exports = router;