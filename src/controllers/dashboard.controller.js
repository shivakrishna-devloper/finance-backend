
const dashboardService = require("../services/dashboard.service");

/**
 * GET /api/dashboard
 * All roles — full dashboard data in one call
 */
function getFullDashboard(req, res, next) {
  try {
    const data = dashboardService.getFullDashboard();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/dashboard/summary
 * All roles — total income, expenses, net balance
 */
function getSummary(req, res, next) {
  try {
    const data = dashboardService.getSummary();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/dashboard/categories
 * Analyst and Admin — category wise totals
 */
function getCategoryTotals(req, res, next) {
  try {
    const data = dashboardService.getCategoryTotals();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/dashboard/trends/monthly
 * Analyst and Admin — monthly trends
 */
function getMonthlyTrends(req, res, next) {
  try {
    const data = dashboardService.getMonthlyTrends();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/dashboard/trends/weekly
 * Analyst and Admin — weekly trends
 */
function getWeeklyTrends(req, res, next) {
  try {
    const data = dashboardService.getWeeklyTrends();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/dashboard/recent
 * All roles — recent activity
 */
function getRecentActivity(req, res, next) {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const data = dashboardService.getRecentActivity({ limit });
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getFullDashboard,
  getSummary,
  getCategoryTotals,
  getMonthlyTrends,
  getWeeklyTrends,
  getRecentActivity,
};