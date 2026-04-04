
const jwt = require("jsonwebtoken");
const { getDb } = require("../database/init");

const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_jwt_key_change_in_production";

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No token provided.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = getDb()
      .prepare("SELECT id, name, email, role, status FROM users WHERE id = ?")
      .get(decoded.id);

    if (!user) {
      return res.status(401).json({ success: false, message: "User no longer exists." });
    }

    if (user.status === "inactive") {
      return res.status(403).json({ success: false, message: "Your account has been deactivated." });
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}

function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Not authenticated." });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${roles.join(" or ")}. Your role: ${req.user.role}`,
      });
    }
    next();
  };
}

module.exports = { authenticate, authorize };