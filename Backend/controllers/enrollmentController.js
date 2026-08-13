import db from "../config/db.js";

export const Enroll_Course = async (req, res) => {
  try {
    const { courseId, studentId } = req.body;
    console.log(courseId, studentId);
    const sql = "INSERT INTO enrollments (student_id, course_id) VALUES (?, ?)";
    db.query(sql, [studentId, courseId], (err, result) => {
      if (err) {
        console.error("Error enrolling in course:", err);
        return res.status(500).json({
          error: "Internal server error",
        });
      }
      res.status(201).json({
        message: "Successfully enrolled in course",
      });
    });
  } catch (error) {
    console.error("Error enrolling in course:", error);
    throw error;
  }
};

export const Get_Enrolled_Courses = async (req, res) => {
  try {
    const Id = req.params.studentId;
    const sql = `SELECT courses.id, courses.name, courses.description, courses.instructor_id
                 FROM enrollments
                 JOIN courses ON enrollments.course_id = courses.id
                 WHERE enrollments.student_id = ?`;
    db.query(sql, [Id], (err, results) => {
      if (err) {
        console.error("Error fetching enrolled courses:", err);
        return res.status(500).json({
          error: "Internal server error",
        });
      }
      res.status(200).json({
        enrollments: results,
      });
      console.log(results);
    });
  } catch (error) {
    console.error("Error fetching enrolled courses:", error);
    throw error;
  }
};
