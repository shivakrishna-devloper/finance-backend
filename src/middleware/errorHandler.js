
function errorHandler(err, req, res, next) {
  console.error(`[ERROR] ${err.message}`);

  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
  if (err.name === "TokenExpiredError") {
    return res.status(401).json({ success: false, message: "Token has expired" });
  }
  if (err.code === "SQLITE_CONSTRAINT_UNIQUE") {
    return res.status(409).json({ success: false, message: "A record with this value already exists" });
  }

  const status = err.statusCode || err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || "Internal server error",
  });
}

module.exports = errorHandler;