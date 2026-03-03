import bcrypt from "bcrypt";
import db from "../config/database.js";

const RegisterUser = (req, res) => {
  try {
    const { name, email, password } = req.body;
    const query = "SELECT * FROM users WHERE email = ?";
    db.query(query, [email], (err, results) => {
      if (err) {
        return res.status(500).json({
          error: "Database error",
        });
      }
      if (results.length > 0) {
        return res.status(409).json({ error: "User already exists" });
      }
      const hashedPassword = bcrypt.hashSync(password, 10);
      const insertQuery =
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
      db.query(insertQuery, [name, email, hashedPassword], (err, results) => {
        if (err) {
          return res.status(500).json({
            error: "Database error",
          });
        }
        res.status(201).json({
          message: "User registered successfully",
        });
      });
    });
  } catch (error) {
    res.status(500).json({
      error: "Error registering user",
    });
  }
};

const LoginUser = (req, res) => {
  try {
    const { email, password } = req.body;
    const query = "SELECT * FROM users WHERE email = ?";

    db.query(query, [email], (err, results) => {
      if (err) {
        return res.status(500).json({
          error: "Database error",
        });
      }

      if (results.length === 0) {
        return res.status(401).json({
          error: "Invalid credentials",
        });
      }

      const user = results[0];
      if (user.password === password) {
        res.json({
          message: "Login successful",
          user,
        });
      } else {
        res.status(401).json({
          error: "Invalid credentials",
        });
      }
    });
  } catch (error) {
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export { RegisterUser, LoginUser };
