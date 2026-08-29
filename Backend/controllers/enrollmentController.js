import db from "../config/db.js";

export const Enroll_Course = async (req, res) => {
  try {
    const { courseId, studentId, teacherId } = req.body;

    const checkSql = `SELECT
        id
        FROM
        enrollments
        WHERE
        student_id = ?
        AND course_id = ?`;

    db.query(checkSql, [studentId, courseId], (err, rows) => {
      if (err) {
        console.error("Error checking enrollment:", err);

        return res.status(500).json({
          error: "Internal server error",
        });
      }

      // Already enrolled
      if (rows.length > 0) {
        return res.status(409).json({
          error: "Student is already enrolled in this course",
        });
      }

      // Insert enrollment
      const sql_enroll = `INSERT INTO
          enrollments (student_id, teacher_id, course_id)
          VALUES
          (?, ?, ?)`;
      const sql_count = `UPDATE courses
          SET
          count = count + 1
          WHERE
          id = ?;`;

      db.query(sql_enroll, [studentId, teacherId, courseId], (err, result) => {
        if (err) {
          console.error("Error enrolling in course:", err);

          // Database unique constraint
          if (err.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
              error: "Student is already enrolled in this course",
            });
          }

          return res.status(500).json({
            error: "Internal server error",
          });
        } else {
          db.query(sql_count, [courseId], (err, result) => {
            if (err) {
              console.error("Error updating course count:", err);
              return res.status(500).json({
                error: "Internal server error",
              });
            } else {
              return res.status(200).json({
                message: "Student enrolled the course successfully",
              });
            }
          });
        }
      });
    });
  } catch (error) {
    console.error("Error enrolling in course:", error);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
};
export const Get_Enrolled_Courses = async (req, res) => {
  const { userRole, courseId } = req.query;
  try {
    if (userRole === "student") {
      const studentId = req.params.userId;
      const sql_enrolled = `SELECT
          c.id,
          c.course_name,
          c.course_code,
          e.enrollment_date
          FROM
          enrollments e
          JOIN courses c ON e.course_id = c.id
          WHERE
          e.student_id = ?`;
      db.query(sql_enrolled, [studentId], (err, results) => {
        if (err) {
          console.error("Error fetching enrolled courses:", err);
          return res.status(500).json({
            error: "Internal server error",
          });
        } else {
          res.status(200).json({
            enrollments: results,
          });
        }
      });
    } else if (
      (userRole === "admin" && courseId) ||
      (userRole === "teacher" && courseId)
    ) {
      const sql_enrolled = `SELECT
          s.id,
          s.first_name,
          s.last_name,
          s.email,
          e.enrollment_date,
          e.course_id,
          e.status
          FROM
          enrollments e
          LEFT JOIN students s ON e.student_id = s.id
          LEFT JOIN courses c ON e.course_id = c.id
          WHERE
          e.course_id = ?`;
      db.query(sql_enrolled, [courseId], (err, results) => {
        if (err) {
          console.error("Error fetching enrolled courses:", err);
          return res.status(500).json({
            error: "Internal server error",
          });
        } else {
          res.status(200).json({
            enrollments: results,
          });
        }
      });
    } else if (userRole === "teacher") {
      const teacherId = req.params.userId;
      const sql_enrolled = `SELECT DISTINCT
          s.id,
          s.first_name,
          s.last_name,
          s.email
          FROM
          enrollments e
          LEFT JOIN students s ON e.student_id = s.id
          WHERE
          e.teacher_id = ?`;
      db.query(sql_enrolled, [teacherId], (err, results) => {
        if (err) {
          console.error("Error fetching enrolled courses:", err);
          return res.status(500).json({
            error: "Internal server error",
          });
        } else {
          res.status(200).json({
            enrollments: results,
          });
        }
      });
    }
  } catch (error) {
    console.error("Error fetching enrolled courses:", error);
    throw error;
  }
};
