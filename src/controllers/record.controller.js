
const recordService = require("../services/record.service");

/**
 * GET /api/records
 * All roles — list records with filters and pagination
 */
function getAllRecords(req, res, next) {
  try {
    const {
      page = 1,
      limit = 10,
      type,
      category,
      startDate,
      endDate,
    } = req.query;

    const result = recordService.getAllRecords({
      page: parseInt(page),
      limit: parseInt(limit),
      type,
      category,
      startDate,
      endDate,
    });

    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/records/:id
 * All roles — get single record
 */
function getRecordById(req, res, next) {
  try {
    const record = recordService.getRecordById(parseInt(req.params.id));
    res.json({ success: true, data: record });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/records
 * Admin and Analyst only — create record
 */
function createRecord(req, res, next) {
  try {
    const { amount, type, category, date, notes } = req.body;
    const record = recordService.createRecord({
      amount: parseFloat(amount),
      type,
      category,
      date,
      notes,
      createdBy: req.user.id,
    });
    res.status(201).json({
      success: true,
      message: "Record created successfully.",
      data: record,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/records/:id
 * Admin and Analyst only — update record
 */
function updateRecord(req, res, next) {
  try {
    const { amount, type, category, date, notes } = req.body;
    const record = recordService.updateRecord(parseInt(req.params.id), {
      amount: amount ? parseFloat(amount) : undefined,
      type,
      category,
      date,
      notes,
    });
    res.json({
      success: true,
      message: "Record updated successfully.",
      data: record,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/records/:id
 * Admin only — soft delete record
 */
function deleteRecord(req, res, next) {
  try {
    const result = recordService.deleteRecord(parseInt(req.params.id));
    res.json({ success: true, message: result.message });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllRecords,
  getRecordById,
  createRecord,
  updateRecord,
  deleteRecord,
};