const authService = require("../services/auth.service");

function register(req, res, next) {
  try {
    const { name, email, password, role } = req.body;
    const assignedRole = req.user && req.user.role === "admin" ? role || "viewer" : "viewer";
    const user = authService.register({ name, email, password, role: assignedRole });
    res.status(201).json({ success: true, message: "User registered successfully.", data: user });
  } catch (err) {
    next(err);
  }
}

function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const result = authService.login({ email, password });
    res.json({ success: true, message: "Login successful.", data: result });
  } catch (err) {
    next(err);
  }
}

function getProfile(req, res, next) {
  try {
    const user = authService.getProfile(req.user.id);
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, getProfile };