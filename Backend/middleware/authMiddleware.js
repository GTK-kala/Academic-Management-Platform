import jwt from "jsonwebtoken";
import db from "../config/db.js";

export const VerifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(400).json({
      message: "No Token Found!!!",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    req.user = decoded;
    next();
  });
};

export const VerifyUser = (req, res, next) => {
  const role = req.user.role;

  const sql = "SELECT * FROM users WHERE role = ?";
  if (role === "admin") {
    db.query(sql, [role], (err, result) => {
      if (err) {
        return res.status(500).json({
          message: "Server Error!!!",
        });
      } else if (result.length === 0) {
        return res.status(500).json({
          message: "User not found!!!",
        });
      } else {
        req.user = result[0];
        next();
      }
    });
  } else {
    return res.status(403).json({
      message: "Access denied. Admins only.",
    });
  }
};
