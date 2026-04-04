
const { body, param, query, validationResult } = require("express-validator");

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

const createRecordRules = [
  body("amount")
    .notEmpty().withMessage("Amount is required")
    .isFloat({ min: 0.01 }).withMessage("Amount must be a positive number"),

  body("type")
    .notEmpty().withMessage("Type is required")
    .isIn(["income", "expense"]).withMessage("Type must be income or expense"),

  body("category")
    .trim()
    .notEmpty().withMessage("Category is required")
    .isLength({ min: 2, max: 50 }).withMessage("Category must be 2–50 characters"),

  body("date")
    .notEmpty().withMessage("Date is required")
    .isDate({ format: "YYYY-MM-DD" }).withMessage("Date must be in YYYY-MM-DD format"),

  body("notes")
    .optional()
    .trim()
    .isLength({ max: 255 }).withMessage("Notes must be under 255 characters"),
];

const updateRecordRules = [
  param("id")
    .isInt({ min: 1 }).withMessage("Invalid record ID"),

  body("amount")
    .optional()
    .isFloat({ min: 0.01 }).withMessage("Amount must be a positive number"),

  body("type")
    .optional()
    .isIn(["income", "expense"]).withMessage("Type must be income or expense"),

  body("category")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage("Category must be 2–50 characters"),

  body("date")
    .optional()
    .isDate({ format: "YYYY-MM-DD" }).withMessage("Date must be in YYYY-MM-DD format"),

  body("notes")
    .optional()
    .trim()
    .isLength({ max: 255 }).withMessage("Notes must be under 255 characters"),
];

const recordIdRule = [
  param("id")
    .isInt({ min: 1 }).withMessage("Invalid record ID"),
];

const filterRules = [
  query("type")
    .optional()
    .isIn(["income", "expense"]).withMessage("Type must be income or expense"),

  query("page")
    .optional()
    .isInt({ min: 1 }).withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100"),

  query("startDate")
    .optional()
    .isDate({ format: "YYYY-MM-DD" }).withMessage("startDate must be in YYYY-MM-DD format"),

  query("endDate")
    .optional()
    .isDate({ format: "YYYY-MM-DD" }).withMessage("endDate must be in YYYY-MM-DD format"),
];

module.exports = {
  validate,
  createRecordRules,
  updateRecordRules,
  recordIdRule,
  filterRules,
};