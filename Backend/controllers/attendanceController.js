import db from "../config/db.js";

const Get_Attendances = (req, res) => {
  const { userId } = req.params;
  const { userRole, courseId } = req.query;
  try {
    if (userRole === "admin" && courseId === undefined) {
      const attendance_sql = `SELECT * FROM attendance`;
      db.query(attendance_sql, (err, results) => {
        if (err) {
          console.error("Error fetching attendance:", err);
          return res.status(500).json({ error: "Failed to fetch attendance" });
        } else if (results.length === 0) {
          res.status(201).json({
            message: "No Students Attendance recorded admin",
          });
        } else if (results.length > 0) {
          res.status(201).json({
            message: "All Student Attendance recorded admin",
            attendance: results,
          });
        }
      });
    } else if (userRole === "admin" && courseId) {
      const attendance_sql = `SELECT * FROM attendance a WHERE a.course_id = ?`;
      db.query(attendance_sql, [attendance_sql], (err, results) => {
        if (err) {
          console.error("Error fetching attendance:", err);
          return res.status(500).json({ error: "Failed to fetch attendance" });
        } else if (results.length === 0) {
          res.status(201).json({
            message: "No Student Attendance record for this course admin",
            attendance: results,
          });
        } else if (results.length > 0) {
          res.status(201).json({
            message: "Student Attendance recorded for this course admin",
            attendance: results,
          });
        }
      });
    } else if (userRole === "teacher" && courseId === undefined) {
      const attendance_sql = `SELECT * FROM attendance`;
      db.query(attendance_sql, (err, results) => {
        if (err) {
          console.error("Error fetching attendance:", err);
          return res.status(500).json({ error: "Failed to add grade" });
        } else if (results.length === 0) {
          res.status(201).json({
            message: " No Students Attendance records teacher",
            attendance: results,
          });
        } else if (results.length > 0) {
          res.status(201).json({
            message: "Students Attendance records teacher",
            attendance: results,
          });
        }
      });
    } else if (userRole === "teacher" && courseId) {
      const attendance_sql = `SELECT * FROM attendance a WHERE a.course_id = ?`;
      db.query(attendance_sql, [attendance_sql], (err, results) => {
        if (err) {
          console.error("Error fetching attendance:", err);
          return res
            .status(500)
            .json({ error: "Failed to fetch attendance teacher " });
        } else if (results.length === 0) {
          res.status(201).json({
            message: "No Student Attendance record for this course teacher",
            attendance: results,
          });
        } else if (results.length > 0) {
          res.status(201).json({
            message: "Student Attendance record for this course teacher",
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

const Add_Attendances = (req, res) => {
  const { attendanceData } = req.body;
  console.log(attendanceData);
  try {
  } catch (error) {}
};

export { Get_Attendances, Add_Attendances };
