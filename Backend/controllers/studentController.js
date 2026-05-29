import bcrypt from "bcryptjs";
import db from "../config/db.js";

const AddStudent = (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;
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
        const { date_of_birth, gender, phone, address } = req.body;
        const sql_student_first =
          "INSERT INTO users (first_name, last_name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)";
        db.query(
          sql_student_first,
          [first_name, last_name, email, hashedPassword, "student"],
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
                      });
                    },
                  );
                }
              });
            }
          },
        );
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create user",
      error: error.message,
    });
  }
};

const getRecentStudents = (req, res) => {
  try {
    const sql = "SELECT * FROM students ORDER BY enrollment_date DESC LIMIT 5";
    db.query(sql, (err, results) => {
      if (err) {
        return res.status(500).json({
          message: "Failed to fetch recent students",
          error: err.message,
        });
      }
      res.status(200).json({
        message: "Recent students fetched successfully",
        data: results,
      });
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch recent students",
      error: error.message,
    });
  }
};

export { AddStudent, getRecentStudents };
