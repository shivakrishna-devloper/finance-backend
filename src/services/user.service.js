
const bcrypt = require("bcryptjs");
const { getDb } = require("../database/init");

function sanitizeUser(user) {
  const { password, ...safe } = user;
  return safe;
}

/**
 * Get all users with optional pagination
 */
function getAllUsers({ page = 1, limit = 10, role, status } = {}) {
  const db = getDb();
  const offset = (page - 1) * limit;

  let query = "SELECT * FROM users WHERE 1=1";
  let countQuery = "SELECT COUNT(*) as total FROM users WHERE 1=1";
  const params = [];

  if (role) {
    query += " AND role = ?";
    countQuery += " AND role = ?";
    params.push(role);
  }

  if (status) {
    query += " AND status = ?";
    countQuery += " AND status = ?";
    params.push(status);
  }

  const total = db.prepare(countQuery).get(...params).total;

  query += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
  const users = db.prepare(query).all(...params, limit, offset);

  return {
    users: users.map(sanitizeUser),
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * Get single user by ID
 */
function getUserById(id) {
  const db = getDb();
  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(id);

  if (!user) {
    const err = new Error("User not found.");
    err.statusCode = 404;
    throw err;
  }

  return sanitizeUser(user);
}

/**
 * Create a new user (admin only)
 */
function createUser({ name, email, password, role }) {
  const db = getDb();

  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
  if (existing) {
    const err = new Error("Email is already registered.");
    err.statusCode = 409;
    throw err;
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  const result = db.prepare(`
    INSERT INTO users (name, email, password, role)
    VALUES (@name, @email, @password, @role)
  `).run({ name, email, password: hashedPassword, role });

  const newUser = db.prepare("SELECT * FROM users WHERE id = ?").get(result.lastInsertRowid);
  return sanitizeUser(newUser);
}

/**
 * Update user role or status (admin only)
 */
function updateUser(id, { name, role, status }) {
  const db = getDb();

  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(id);
  if (!user) {
    const err = new Error("User not found.");
    err.statusCode = 404;
    throw err;
  }

  const updatedName   = name   ?? user.name;
  const updatedRole   = role   ?? user.role;
  const updatedStatus = status ?? user.status;

  db.prepare(`
    UPDATE users
    SET name = @name, role = @role, status = @status, updated_at = datetime('now')
    WHERE id = @id
  `).run({ name: updatedName, role: updatedRole, status: updatedStatus, id });

  const updatedUser = db.prepare("SELECT * FROM users WHERE id = ?").get(id);
  return sanitizeUser(updatedUser);
}

/**
 * Delete a user (admin only)
 * Prevents deleting yourself
 */
function deleteUser(id, requestingUserId) {
  const db = getDb();

  if (id === requestingUserId) {
    const err = new Error("You cannot delete your own account.");
    err.statusCode = 400;
    throw err;
  }

  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(id);
  if (!user) {
    const err = new Error("User not found.");
    err.statusCode = 404;
    throw err;
  }

  db.prepare("DELETE FROM users WHERE id = ?").run(id);

  return { message: "User deleted successfully." };
}

module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser };