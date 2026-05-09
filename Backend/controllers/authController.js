import bcrypt from "bcryptjs";
import db from "../config/db.js";

const CreateUser = (req, res) => {
  try {
    const { first_name, last_name, email, password, role } = req.body;
    const sql1 = "SELECT * FROM users WHERE email = ?";

    // Basic validation
    if (!first_name || !last_name || !email || !password || !role) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
    db.query(sql1, [email], (err, results) => {
      if (err) {
        return res.status(500).json({
          message: "Failed to check email",
          error: err.message,
        });
      }
      if (results.length > 0) {
        return res.status(400).json({
          message: "Email already exists",
        });
      }
      // Hash the password
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
          return res.status(500).json({
            message: "Failed to hash password",
            error: err.message,
          });
        }
        // Insert the new user into the database
        const sql2 =
          "INSERT INTO users (first_name, last_name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)";
        db.query(
          sql2,
          [first_name, last_name, email, hashedPassword, role],
          (err, results) => {
            if (err) {
              console.log(err.message);
              return res.status(500).json({
                message: "Failed to create user",
                error: err.message,
              });
            }
            res.status(201).json({
              message: "User created successfully",
              userId: results.insertId,
            });
          },
        );
      });
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create user",
      error: error.message,
    });
  }
};

export { CreateUser };
