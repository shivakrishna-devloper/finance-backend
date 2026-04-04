
const express = require("express");
const router = express.Router();

const recordController = require("../controllers/record.controller");
const { authenticate, authorize } = require("../middleware/auth");
const {
  validate,
  createRecordRules,
  updateRecordRules,
  recordIdRule,
  filterRules,
} = require("../validators/record.validator");

// All record routes require login
router.use(authenticate);

// GET /api/records — all roles can view
router.get(
  "/",
  filterRules,
  validate,
  recordController.getAllRecords
);

// GET /api/records/:id — all roles can view
router.get(
  "/:id",
  recordIdRule,
  validate,
  recordController.getRecordById
);

// POST /api/records — admin and analyst only
router.post(
  "/",
  authorize("admin", "analyst"),
  createRecordRules,
  validate,
  recordController.createRecord
);

// PUT /api/records/:id — admin and analyst only
router.put(
  "/:id",
  authorize("admin", "analyst"),
  updateRecordRules,
  validate,
  recordController.updateRecord
);

// DELETE /api/records/:id — admin only (soft delete)
router.delete(
  "/:id",
  authorize("admin"),
  recordIdRule,
  validate,
  recordController.deleteRecord
);

module.exports = router;