import bcrypt from "bcryptjs";
import db from "../config/db.js";

const Add_Student = (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;
    const sql = `SELECT
        *
        FROM
        users
        WHERE
        email = ?`;
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
        const sql_student_first = `INSERT INTO
            users (first_name, last_name, email, password_hash, role)
            VALUES
            (?, ?, ?, ?, ?)`;
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
              const sql_user_id = `SELECT
                  id
                  FROM
                  users
                  WHERE
                  email = ?`;
              db.query(sql_user_id, [email], (err, userResults) => {
                if (err) {
                  res.status(500).json({
                    message: "Failed to retrieve user ID",
                    error: err.message,
                  });
                } else {
                  const userId = userResults[0].id;
                  const sql_student_second = `INSERT INTO
                      students (
                      user_id,
                      first_name,
                      last_name,
                      email,
                      password,
                      date_of_birth,
                      gender,
                      phone,
                      address,
                      enrollment_date
                      )
                      VALUES
                      (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
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

const Get_Students = (req, res) => {
  try {
    const userRole = req.query.userRole;
    const userId = req.params.userId;
    if (userRole === "admin") {
      const sql = `SELECT
          *
          FROM
          students
          ORDER BY
          enrollment_date DESC
          `;
      db.query(sql, (err, results) => {
        if (err) {
          return res.status(500).json({
            message: "Failed to fetch recent students",
            error: err.message,
          });
        }
        res.status(200).json({
          message: "Recent students fetched successfully",
          students: results,
        });
      });
    } else if (userRole === "teacher") {
      const sql = `SELECT DISTINCT
          s.*
          FROM
          enrollments e
          JOIN students s ON e.student_id = s.id
          WHERE
          e.teacher_id = ?
          ORDER BY
          s.enrollment_date`;
      db.query(sql, [userId], (err, results) => {
        if (err) {
          return res.status(500).json({
            message: "Failed to fetch recent students",
            error: err.message,
          });
        }
        res.status(200).json({
          message: "Recent students fetched successfully",
          students: results,
        });
      });
    } else {
      return res.status(403).json({
        message: "Access denied",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch recent students",
      error: error.message,
    });
  }
};

const Get_Student = (req, res) => {
  try {
    const { userRole } = req.query;
    const { studentId } = req.params;
    if (userRole === "admin" || userRole === "teacher") {
      const student_sql = `SELECT
          *
          FROM
          students
          WHERE
          id = ?`;
      db.query(student_sql, [studentId], (err, results) => {
        if (err) {
          return res.status(500).json({
            message: "Failed to fetch recent students",
            error: err.message,
          });
        }
        res.status(200).json({
          message: "Recent students fetched successfully",
          student: results[0],
        });
      });
    } else {
      return res.status(403).json({
        message: "Access denied",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch recent students",
      error: error.message,
    });
  }
};

const Edit_Student = (req, res) => {
  const { studentId } = req.params;
  const {
    first_name,
    last_name,
    password,
    date_of_birth,
    gender,
    phone,
    address,
  } = req.body;
  let fields = [];
  let values = [];
  try {
    if (first_name !== undefined) {
      fields.push("first_name = ?");
      values.push(first_name);
    }
    if (last_name !== undefined) {
      fields.push("last_name = ?");
      values.push(last_name);
    }
    if (password !== undefined) {
      const hashedPassword = bcrypt.hashSync(password, 10);
      fields.push("password = ?");
      values.push(hashedPassword);
    }
    if (date_of_birth !== undefined) {
      fields.push("date_of_birth = ?");
      values.push(date_of_birth);
    }
    if (gender !== undefined) {
      fields.push("gender = ?");
      values.push(gender);
    }
    if (phone !== undefined) {
      fields.push("phone = ?");
      values.push(phone);
    }
    if (address !== undefined) {
      fields.push("address = ?");
      values.push(address);
    }
    values.push(studentId);

    const edit_sql = `UPDATE students
        SET
        ${fields.join(", ")}
        WHERE
        id = ?`;
    db.query(edit_sql, values, (err, result) => {
      if (err) {
        return res.status(500).json({
          message: err,
        });
      } else {
        return res.status(200).json({
          message: "student info updated !!!",
          result: result[0],
        });
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to edit student",
      error: error.message,
    });
  }
};

// const Get_Recent_Students = (req, res) => {
//   try {
//     const sql = "SELECT * FROM students ORDER BY enrollment_date DESC LIMIT 5";
//     db.query(sql, (err, results) => {
//       if (err) {
//         return res.status(500).json({
//           message: "Failed to fetch recent students",
//           error: err.message,
//         });
//       }
//       res.status(200).json({
//         message: "Recent students fetched successfully",
//         students: results,
//       });
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Failed to fetch recent students",
//       error: error.message,
//     });
//   }
// };

export { Add_Student, Get_Students, Get_Student, Edit_Student };
