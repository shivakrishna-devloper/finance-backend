
const { getDb } = require("../database/init");

/**
 * Get overall summary — total income, expenses, net balance
 */
function getSummary() {
  const db = getDb();

  const income = db
    .prepare(
      `SELECT COALESCE(SUM(amount), 0) as total
       FROM financial_records
       WHERE type = 'income' AND is_deleted = 0`
    )
    .get().total;

  const expenses = db
    .prepare(
      `SELECT COALESCE(SUM(amount), 0) as total
       FROM financial_records
       WHERE type = 'expense' AND is_deleted = 0`
    )
    .get().total;

  const totalRecords = db
    .prepare(
      `SELECT COUNT(*) as total
       FROM financial_records
       WHERE is_deleted = 0`
    )
    .get().total;

  return {
    totalIncome:   parseFloat(income.toFixed(2)),
    totalExpenses: parseFloat(expenses.toFixed(2)),
    netBalance:    parseFloat((income - expenses).toFixed(2)),
    totalRecords,
  };
}

/**
 * Get category wise totals
 */
function getCategoryTotals() {
  const db = getDb();

  const income = db
    .prepare(
      `SELECT category,
              ROUND(SUM(amount), 2) as total,
              COUNT(*) as count
       FROM financial_records
       WHERE type = 'income' AND is_deleted = 0
       GROUP BY category
       ORDER BY total DESC`
    )
    .all();

  const expenses = db
    .prepare(
      `SELECT category,
              ROUND(SUM(amount), 2) as total,
              COUNT(*) as count
       FROM financial_records
       WHERE type = 'expense' AND is_deleted = 0
       GROUP BY category
       ORDER BY total DESC`
    )
    .all();

  return { income, expenses };
}

/**
 * Get monthly trends
 */
function getMonthlyTrends() {
  const db = getDb();

  const trends = db
    .prepare(
      `SELECT
         strftime('%Y-%m', date) as month,
         ROUND(SUM(CASE WHEN type = 'income'  THEN amount ELSE 0 END), 2) as income,
         ROUND(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 2) as expenses,
         ROUND(SUM(CASE WHEN type = 'income'  THEN amount ELSE 0 END) -
               SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 2) as net
       FROM financial_records
       WHERE is_deleted = 0
       GROUP BY strftime('%Y-%m', date)
       ORDER BY month DESC
       LIMIT 12`
    )
    .all();

  return trends;
}

/**
 * Get weekly trends
 */
function getWeeklyTrends() {
  const db = getDb();

  const trends = db
    .prepare(
      `SELECT
         strftime('%Y-W%W', date) as week,
         ROUND(SUM(CASE WHEN type = 'income'  THEN amount ELSE 0 END), 2) as income,
         ROUND(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 2) as expenses,
         ROUND(SUM(CASE WHEN type = 'income'  THEN amount ELSE 0 END) -
               SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 2) as net
       FROM financial_records
       WHERE is_deleted = 0
       GROUP BY strftime('%Y-W%W', date)
       ORDER BY week DESC
       LIMIT 8`
    )
    .all();

  return trends;
}

/**
 * Get recent activity — last 10 records
 */
function getRecentActivity({ limit = 10 } = {}) {
  const db = getDb();

  const records = db
    .prepare(
      `SELECT r.id,
              r.amount,
              r.type,
              r.category,
              r.date,
              r.notes,
              u.name as created_by_name
       FROM financial_records r
       LEFT JOIN users u ON r.created_by = u.id
       WHERE r.is_deleted = 0
       ORDER BY r.created_at DESC
       LIMIT @limit`
    )
    .all({ limit });

  return records;
}

/**
 * Get full dashboard — all data in one call
 */
function getFullDashboard() {
  return {
    summary:        getSummary(),
    categoryTotals: getCategoryTotals(),
    monthlyTrends:  getMonthlyTrends(),
    recentActivity: getRecentActivity({ limit: 5 }),
  };
}

module.exports = {
  getSummary,
  getCategoryTotals,
  getMonthlyTrends,
  getWeeklyTrends,
  getRecentActivity,
  getFullDashboard,
};