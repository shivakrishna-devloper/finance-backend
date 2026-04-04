
const userService = require("../services/user.service");

/**
 * GET /api/users
 * Admin only — list all users with pagination and filters
 */
function getAllUsers(req, res, next) {
  try {
    const { page = 1, limit = 10, role, status } = req.query;
    const result = userService.getAllUsers({
      page: parseInt(page),
      limit: parseInt(limit),
      role,
      status,
    });
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/users/:id
 * Admin only — get single user
 */
function getUserById(req, res, next) {
  try {
    const user = userService.getUserById(parseInt(req.params.id));
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/users
 * Admin only — create a new user with any role
 */
function createUser(req, res, next) {
  try {
    const { name, email, password, role } = req.body;
    const user = userService.createUser({ name, email, password, role });
    res.status(201).json({
      success: true,
      message: "User created successfully.",
      data: user,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/users/:id
 * Admin only — update name, role or status
 */
function updateUser(req, res, next) {
  try {
    const { name, role, status } = req.body;
    const user = userService.updateUser(parseInt(req.params.id), { name, role, status });
    res.json({
      success: true,
      message: "User updated successfully.",
      data: user,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/users/:id
 * Admin only — delete a user
 */
function deleteUser(req, res, next) {
  try {
    const result = userService.deleteUser(parseInt(req.params.id), req.user.id);
    res.json({ success: true, message: result.message });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser };