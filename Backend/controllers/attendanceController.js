import db from "../config/db.js";

const Get_Attendances = (req, res) => {
  // const { userId } = req.params;
  const { userRole, courseId, userId } = req.query;
  try {
    if (userRole === "admin" && courseId === "all") {
      const attendance_sql = `SELECT
          a.*,
          s.first_name,
          s.last_name,
          c.course_name
          FROM
          attendance a
          LEFT JOIN students s ON a.student_id = s.id
          LEFT JOIN courses c ON a.course_id = c.id`;
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
    } else if (userRole === "admin" && courseId !== "all") {
      const attendance_sql = `SELECT
          a.*,
          s.first_name,
          s.last_name,
          c.course_name
          FROM
          attendance a
          LEFT JOIN students s ON a.student_id = s.id
          LEFT JOIN courses c ON a.course_id = c.id
          WHERE
          a.course_id = ?`;
      db.query(attendance_sql, [courseId], (err, results) => {
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
    } else if (userRole === "teacher" && courseId === "all") {
      const attendance_sql = `SELECT
          a.*,
          s.first_name,
          s.last_name,
          c.course_name
          FROM
          attendance a
          LEFT JOIN students s ON a.student_id = s.id
          LEFT JOIN courses c ON a.course_id = c.id
          WHERE
          a.recorded_by = ?`;
      db.query(attendance_sql, [userId], (err, results) => {
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
    } else if (userRole === "teacher" && courseId !== "all") {
      const attendance_sql = `SELECT
          a.*,
          s.first_name,
          s.last_name,
          c.course_name
          FROM
          attendance a
          LEFT JOIN students s ON a.student_id = s.id
          LEFT JOIN courses c ON a.course_id = c.id
          WHERE
          a.course_id = ?
          AND a.recorded_by = ?`;
      db.query(attendance_sql, [courseId, userId], (err, results) => {
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
  try {
    const { student_id, course_id, recorded_by, status, attendance_date } =
      req.body;

    const attendance_sql = `INSERT INTO
        attendance (
        student_id,
        course_id,
        attendance_date,
        status,
        recorded_by
        )
        VALUES
        (?, ?, ?, ?, ?)`;
    db.query(
      attendance_sql,
      [student_id, course_id, attendance_date, status, recorded_by],
      (err, results) => {
        if (err) {
          return res.status(500).json({
            message: "Failed to add attendance",
            error: err.message,
          });
        } else {
          res.status(201).json({
            message: "User attendance added",
            userId: results.insertId,
          });
        }
      },
    );
  } catch (error) {
    console.error("Error fetching attendance:", error);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export { Get_Attendances, Add_Attendances };
