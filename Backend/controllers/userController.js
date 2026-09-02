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

export { Get_User };
