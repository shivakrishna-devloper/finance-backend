const express = require("express");
const router = express.Router();

const dashboardController = require("../controllers/dashboard.controller");
const { authenticate, authorize } = require("../middleware/auth");

// All dashboard routes require login
router.use(authenticate);

// GET /api/dashboard — full dashboard (all roles)
router.get(
  "/",
  dashboardController.getFullDashboard
);

// GET /api/dashboard/summary — all roles
router.get(
  "/summary",
  dashboardController.getSummary
);

// GET /api/dashboard/categories — analyst and admin only
router.get(
  "/categories",
  authorize("admin", "analyst"),
  dashboardController.getCategoryTotals
);

// GET /api/dashboard/trends/monthly — analyst and admin only
router.get(
  "/trends/monthly",
  authorize("admin", "analyst"),
  dashboardController.getMonthlyTrends
);

// GET /api/dashboard/trends/weekly — analyst and admin only
router.get(
  "/trends/weekly",
  authorize("admin", "analyst"),
  dashboardController.getWeeklyTrends
);

// GET /api/dashboard/recent — all roles
router.get(
  "/recent",
  dashboardController.getRecentActivity
);

module.exports = router;