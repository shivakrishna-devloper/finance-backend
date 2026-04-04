
const { getDb } = require("../database/init");

/**
 * Get all financial records with filters and pagination
 */
function getAllRecords({
  page = 1,
  limit = 10,
  type,
  category,
  startDate,
  endDate,
} = {}) {
  const db = getDb();
  const offset = (page - 1) * limit;

  let whereClause = "WHERE is_deleted = 0";
  const params = {};

  if (type) {
    whereClause += " AND type = @type";
    params.type = type;
  }

  if (category) {
    whereClause += " AND category LIKE @category";
    params.category = `%${category}%`;
  }

  if (startDate) {
    whereClause += " AND date >= @startDate";
    params.startDate = startDate;
  }

  if (endDate) {
    whereClause += " AND date <= @endDate";
    params.endDate = endDate;
  }

  const total = db
    .prepare(`SELECT COUNT(*) as total FROM financial_records ${whereClause}`)
    .get(params).total;

  const records = db
    .prepare(
      `SELECT r.*, u.name as created_by_name
       FROM financial_records r
       LEFT JOIN users u ON r.created_by = u.id
       ${whereClause}
       ORDER BY r.date DESC, r.created_at DESC
       LIMIT @limit OFFSET @offset`
    )
    .all({ ...params, limit, offset });

  return {
    records,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * Get single record by ID
 */
function getRecordById(id) {
  const db = getDb();

  const record = db
    .prepare(
      `SELECT r.*, u.name as created_by_name
       FROM financial_records r
       LEFT JOIN users u ON r.created_by = u.id
       WHERE r.id = ? AND r.is_deleted = 0`
    )
    .get(id);

  if (!record) {
    const err = new Error("Record not found.");
    err.statusCode = 404;
    throw err;
  }

  return record;
}

/**
 * Create a new financial record
 */
function createRecord({ amount, type, category, date, notes, createdBy }) {
  const db = getDb();

  const result = db
    .prepare(
      `INSERT INTO financial_records (amount, type, category, date, notes, created_by)
       VALUES (@amount, @type, @category, @date, @notes, @createdBy)`
    )
    .run({ amount, type, category, date, notes: notes || null, createdBy });

  const newRecord = db
    .prepare(
      `SELECT r.*, u.name as created_by_name
       FROM financial_records r
       LEFT JOIN users u ON r.created_by = u.id
       WHERE r.id = ?`
    )
    .get(result.lastInsertRowid);

  return newRecord;
}

/**
 * Update a financial record
 */
function updateRecord(id, { amount, type, category, date, notes }) {
  const db = getDb();

  const record = db
    .prepare("SELECT * FROM financial_records WHERE id = ? AND is_deleted = 0")
    .get(id);

  if (!record) {
    const err = new Error("Record not found.");
    err.statusCode = 404;
    throw err;
  }

  const updatedAmount   = amount   ?? record.amount;
  const updatedType     = type     ?? record.type;
  const updatedCategory = category ?? record.category;
  const updatedDate     = date     ?? record.date;
  const updatedNotes    = notes    ?? record.notes;

  db.prepare(
    `UPDATE financial_records
     SET amount = @amount,
         type = @type,
         category = @category,
         date = @date,
         notes = @notes,
         updated_at = datetime('now')
     WHERE id = @id`
  ).run({
    amount: updatedAmount,
    type: updatedType,
    category: updatedCategory,
    date: updatedDate,
    notes: updatedNotes,
    id,
  });

  const updatedRecord = db
    .prepare(
      `SELECT r.*, u.name as created_by_name
       FROM financial_records r
       LEFT JOIN users u ON r.created_by = u.id
       WHERE r.id = ?`
    )
    .get(id);

  return updatedRecord;
}

/**
 * Soft delete a financial record (admin only)
 */
function deleteRecord(id) {
  const db = getDb();

  const record = db
    .prepare("SELECT * FROM financial_records WHERE id = ? AND is_deleted = 0")
    .get(id);

  if (!record) {
    const err = new Error("Record not found.");
    err.statusCode = 404;
    throw err;
  }

  db.prepare(
    `UPDATE financial_records
     SET is_deleted = 1, updated_at = datetime('now')
     WHERE id = ?`
  ).run(id);

  return { message: "Record deleted successfully." };
}

module.exports = {
  getAllRecords,
  getRecordById,
  createRecord,
  updateRecord,
  deleteRecord,
};