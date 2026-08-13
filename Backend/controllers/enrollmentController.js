import db from "../config/db.js";

export const Enroll_Course = async (req, res) => {
  try {
    const { courseId, studentId } = req.body;

    console.log("Course ID:", courseId);
    console.log("Student ID:", studentId);

    const checkSql = `
      SELECT id
      FROM enrollments
      WHERE student_id = ? AND course_id = ?
    `;

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
      const sql = `
        INSERT INTO enrollments (student_id, course_id)
        VALUES (?, ?)
      `;

      db.query(sql, [studentId, courseId], (err, result) => {
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
        }

        return res.status(201).json({
          message: "Successfully enrolled in the course",
        });
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
  try {
    const Id = req.params.studentId;
    const sql = `SELECT courses.id, courses.course_name, courses.course_code
                 FROM enrollments 
                 JOIN courses ON enrollments.course_id = courses.id
                 WHERE enrollments.student_id = ?`;
    db.query(sql, [Id], (err, results) => {
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
  } catch (error) {
    console.error("Error fetching enrolled courses:", error);
    throw error;
  }
};
