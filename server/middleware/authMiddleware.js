const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "travelplanner_secret_key_997";

module.exports = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ message: "Brak tokenu autoryzacji" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Nieprawidłowy format autoryzacji" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, username }
    next();
  } catch (err) {
    return res.status(403).json({ message: "Token jest nieprawidłowy lub wygasł" });
  }
};
