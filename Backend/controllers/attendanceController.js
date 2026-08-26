import db from "../config/db.js";

const Get_Attendances = (req, res) => {
  const { userId } = req.params;
  const { userRole } = req.query;
  try {
    if (userRole === "admin") {
      const attendance_sql = `SELECT * FROM attendance`;
      db.query(attendance_sql, (err, results) => {
        if (err) {
          console.error("Error adding grade:", err);
          return res.status(500).json({ error: "Failed to add grade" });
        } else {
          res.status(201).json({
            message: "Student Attendance records",
            attendance: results,
          });
        }
      });
    } else {
      const attendance_sql = `SELECT * FROM attendance`;
      db.query(attendance_sql, (err, results) => {
        if (err) {
          console.error("Error adding grade:", err);
          return res.status(500).json({ error: "Failed to add grade" });
        } else {
          res.status(201).json({
            message: "Student Attendance records",
            attendance: results,
          });
        }
      });
    }
  } catch (error) {
    console.error("Error fetching attendance:", error);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export { Get_Attendances };
