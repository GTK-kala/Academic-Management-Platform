import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../config/db.js";

const CreateUser = (req, res) => {
  try {
    const { first_name, last_name, email, password, role } = req.body;
    const sql1 = "SELECT * FROM users WHERE email = ?";

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

const LoginUser = (req, res) => {
  try {
    const { email, password } = req.body;
    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], (err, results) => {
      if (err) {
        return res.status(500).json({
          message: "Failed to check email",
          error: err.message,
        });
      }
      if (results.length === 0) {
        return res.status(400).json({
          message: "Invalid email or password",
        });
      }
      const user = results[0];
      bcrypt.compare(password, user.password_hash, (err, isMatch) => {
        if (err) {
          return res.status(500).json({
            message: "Failed to compare passwords",
            error: err.message,
          });
        }
        if (!isMatch) {
          return res.status(400).json({
            message: "Invalid email or password",
          });
        }
        const cookie = {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
        };
        const token = jwt.sign(
          { userId: user.id, role: user.role },
          process.env.JWT_SECRET,
          {
            expiresIn: "8h",
          },
        );

        res.status(200).cookie("token", token, cookie).json({
          message: "Login successful",
          userId: user.id,
          role: user.role,
          email: user.email,
        });
      });
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to login user",
      error: error.message,
    });
  }
  // Implement login logic here
};

export { CreateUser, LoginUser };
