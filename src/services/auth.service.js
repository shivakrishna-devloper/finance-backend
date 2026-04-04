
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { getDb } = require("../database/init");

const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_jwt_key_change_in_production";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

function sanitizeUser(user) {
  const { password, ...safe } = user;
  return safe;
}

function register({ name, email, password, role = "viewer" }) {
  const db = getDb();

  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
  if (existing) {
    const err = new Error("Email is already registered.");
    err.statusCode = 409;
    throw err;
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const result = db.prepare(
    `INSERT INTO users (name, email, password, role) VALUES (@name, @email, @password, @role)`
  ).run({ name, email, password: hashedPassword, role });

  const newUser = db.prepare("SELECT * FROM users WHERE id = ?").get(result.lastInsertRowid);
  return sanitizeUser(newUser);
}

function login({ email, password }) {
  const db = getDb();
  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);

  if (!user || !bcrypt.compareSync(password, user.password)) {
    const err = new Error("Invalid email or password.");
    err.statusCode = 401;
    throw err;
  }

  if (user.status === "inactive") {
    const err = new Error("Your account has been deactivated. Contact an admin.");
    err.statusCode = 403;
    throw err;
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  return { token, user: sanitizeUser(user) };
}

function getProfile(userId) {
  const db = getDb();
  const user = db.prepare(
    "SELECT id, name, email, role, status, created_at FROM users WHERE id = ?"
  ).get(userId);

  if (!user) {
    const err = new Error("User not found.");
    err.statusCode = 404;
    throw err;
  }

  return user;
}

module.exports = { register, login, getProfile };