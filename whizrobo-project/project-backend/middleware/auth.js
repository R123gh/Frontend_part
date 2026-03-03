const jwt = require("jsonwebtoken");

const COOKIE_NAME = "token";

const extractTokenFromRequest = (req) => {
  const cookieToken = req.cookies?.[COOKIE_NAME];
  if (cookieToken) return cookieToken;

  const authHeader = req.headers.authorization || "";
  if (authHeader.toLowerCase().startsWith("bearer ")) {
    return authHeader.slice(7).trim();
  }

  return "";
};

const requireAuth = (req, res, next) => {
  const token = extractTokenFromRequest(req);
  if (!token) {
    return res.status(401).json({ msg: "Authentication required." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id };
    return next();
  } catch {
    return res.status(401).json({ msg: "Invalid or expired session." });
  }
};

module.exports = {
  COOKIE_NAME,
  requireAuth,
};
