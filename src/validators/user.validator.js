
const { body, param, validationResult } = require("express-validator");

function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
}

const createUserRules = [
  body("name")
    .trim()
    .notEmpty().withMessage("Name is required")
    .isLength({ min: 2, max: 50 }).withMessage("Name must be 2–50 characters"),

  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email format")
    .normalizeEmail(),

  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
    .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
    .matches(/[0-9]/).withMessage("Password must contain at least one number"),

  body("role")
    .notEmpty().withMessage("Role is required")
    .isIn(["viewer", "analyst", "admin"]).withMessage("Role must be viewer, analyst, or admin"),
];

const updateUserRules = [
  param("id")
    .isInt({ min: 1 }).withMessage("Invalid user ID"),

  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage("Name must be 2–50 characters"),

  body("role")
    .optional()
    .isIn(["viewer", "analyst", "admin"]).withMessage("Role must be viewer, analyst, or admin"),

  body("status")
    .optional()
    .isIn(["active", "inactive"]).withMessage("Status must be active or inactive"),
];

const userIdRule = [
  param("id")
    .isInt({ min: 1 }).withMessage("Invalid user ID"),
];

module.exports = { validate, createUserRules, updateUserRules, userIdRule };