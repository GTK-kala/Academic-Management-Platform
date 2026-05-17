import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../config/db.js";

////////////////// Create User Logic ///////////////

const CreateUser = (req, res) => {
  try {
    const { first_name, last_name, email, password, role } = req.body;
    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], (err, results) => {
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
      } else if (results.length === 0) {
        // Hash the password
        const hashedPassword = bcrypt.hashSync(password, 10);
        if (role === "student") {
          const { date_of_birth, gender, phone, address } = req.body;
          const sql_student_first =
            "INSERT INTO users (first_name, last_name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)";
          db.query(
            sql_student_first,
            [first_name, last_name, email, hashedPassword, role],
            (err, results) => {
              if (err) {
                return res.status(500).json({
                  message: "Failed to create user",
                  error: err.message,
                });
              } else {
                const enrollment_date =
                  new Date().getFullYear() +
                  "-" +
                  (new Date().getMonth() + 1) +
                  "-" +
                  new Date().getDate();
                const sql_user_id = "SELECT id FROM users WHERE email = ?";
                db.query(sql_user_id, [email], (err, userResults) => {
                  if (err) {
                    res.status(500).json({
                      message: "Failed to retrieve user ID",
                      error: err.message,
                    });
                  } else {
                    const userId = userResults[0].id;
                    const sql_student_second =
                      "INSERT INTO students (user_id, first_name, last_name, email, password, date_of_birth, gender, phone, address, enrollment_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                    db.query(
                      sql_student_second,
                      [
                        userId,
                        first_name,
                        last_name,
                        email,
                        hashedPassword,
                        date_of_birth,
                        gender,
                        phone,
                        address,
                        enrollment_date,
                      ],
                      (err) => {
                        if (err) {
                          return res.status(500).json({
                            message: "Failed to create student",
                            error: err.message,
                          });
                        }
                        res.status(201).json({
                          message: "User created successfully",
                          userId: results.insertId,
                          role: role,
                        });
                      },
                    );
                  }
                });
              }
            },
          );
        } else if (role === "teacher") {
          const { department, phone } = req.body;
          const sql_teacher_first =
            "INSERT INTO users (first_name, last_name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)";
          db.query(
            sql_teacher_first,
            [first_name, last_name, email, hashedPassword, role],
            (err, results) => {
              if (err) {
                return res.status(500).json({
                  message: "Failed to create user",
                  error: err.message,
                });
              } else {
                const teacher_id = results.insertId;
                const sql_teacher_second =
                  "INSERT INTO teachers (user_id, first_name, last_name, email, password, department, phone, hire_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
                const hire_date =
                  new Date().getFullYear() +
                  "-" +
                  (new Date().getMonth() + 1) +
                  "-" +
                  new Date().getDate();
                db.query(
                  sql_teacher_second,
                  [
                    teacher_id,
                    first_name,
                    last_name,
                    email,
                    hashedPassword,
                    department,
                    phone,
                    hire_date,
                  ],
                  (err, results) => {
                    if (err) {
                      res.status(500).json({
                        message: "Failed to create teacher",
                        error: err.message,
                      });
                    } else {
                      res.status(201).json({
                        message: "User created successfully",
                        userId: teacher_id,
                        role: role,
                      });
                    }
                  },
                );
              }
            },
          );
        } else if (role === "admin") {
          const sql2 =
            "INSERT INTO users (first_name, last_name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)";
          db.query(
            sql2,
            [first_name, last_name, email, hashedPassword, role],
            (err, results) => {
              if (err) {
                return res.status(500).json({
                  message: "Failed to create user",
                  error: err.message,
                });
              }
              res.status(201).json({
                message: "User created successfully",
                userId: results.insertId,
                role: role,
              });
            },
          );
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create user",
      error: error.message,
    });
  }
};

/////////////// Login User Logic ///////////////

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
