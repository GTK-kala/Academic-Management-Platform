import db from "../config/db.js";

const Get_User = (req, res) => {
  const { userRole } = req.query;
  const { userId } = req.params;
  try {
    if (userRole === "admin") {
      const admin_sql = `SELECT
          *
          FROM
          users
          WHERE
          id = ?`;
      db.query(admin_sql, [userId], (err, results) => {
        if (err) {
          return res.status(500).json({
            message: "Failed to fetch teachers",
            error: err.message,
          });
        }
        res.status(200).json({
          message: "Admin fetched successfully",
          user: results[0],
        });
      });
    } else if (userRole === "teacher") {
      const teacher_sql = `SELECT
          *
          FROM
          teachers
          WHERE
          id = ?`;
      db.query(teacher_sql, [userId], (err, results) => {
        if (err) {
          return res.status(500).json({
            message: "Failed to fetch teachers",
            error: err.message,
          });
        }
        res.status(200).json({
          message: "Teacher fetched successfully",
          user: results[0],
        });
      });
    } else if (userRole === "student") {
      const student_sql = `SELECT
          *
          FROM
          students
          WHERE
          id = ?`;
      db.query(student_sql, [userId], (err, results) => {
        if (err) {
          return res.status(500).json({
            message: "Failed to fetch students",
            error: err.message,
          });
        }
        res.status(200).json({
          message: "Student fetched successfully",
          user: results[0],
        });
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch  users",
      error: error.message,
    });
  }
};

const Update_User = (req, res) => {
  const { userRole } = req.query;
  const { userId } = req.params;
  const { firstName, lastName, phone, address, department } = req.body;
  console.log(firstName, lastName, phone, address, department);
  let fields = [];
  let values = [];
  if (firstName !== undefined) {
    fields.push("first_name = ?");
    values.push(firstName);
  }
  if (lastName !== undefined) {
    fields.push("last_name = ?");
    values.push(lastName);
  }
  try {
    if (userRole === "admin") {
      const admin_sql = `UPDATE users
          SET
          ${fields.join(", ")}
          WHERE
          id = ?`;
      db.query(admin_sql, [values, userId], (err, results) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: "Failed to update admin",
            error: err.message,
          });
        }
        res.status(200).json({
          message: "Admin updated successfully",
          user: results[0],
        });
      });
    } else if (userRole === "teacher") {
      if (phone !== undefined) {
        fields.push("phone = ?");
        values.push(phone);
      }
      if (department !== undefined) {
        fields.push("department = ?");
        values.push(department);
      }

      const teacher_sql = `UPDATE teachers
          SET
          ${fields.join(", ")}
          WHERE
          id = ?`;
      db.query(teacher_sql, [...values, userId], (err, results) => {
        if (err) {
          return res.status(500).json({
            message: "Failed to update teacher",
            error: err.message,
          });
        }
        res.status(200).json({
          message: "Teacher updated successfully",
          user: results[0],
        });
      });
    } else if (userRole === "student") {
      if (phone !== undefined) {
        fields.push("phone = ?");
        values.push(phone);
      }
      if (address !== undefined) {
        fields.push("address = ?");
        values.push(address);
      }

      const student_sql = `UPDATE students
          SET
          ${fields.join(", ")}
          WHERE
          id = ?`;
      db.query(student_sql, [...values, userId], (err, results) => {
        if (err) {
          return res.status(500).json({
            message: "Failed to update student",
            error: err.message,
          });
        }
        res.status(200).json({
          message: "Student updated successfully",
          user: results[0],
        });
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Failed to update user",
      error: error.message,
    });
  }
};

export { Get_User, Update_User };
