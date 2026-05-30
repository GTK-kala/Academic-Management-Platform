import db from "../config/db.js";

export const Add_Course = async (req, res) => {
  try {
    const {
      course_name,
      course_code,
      description,
      credits,
      teacher_id,
      max_capacity,
    } = req.body;
    const sql1 = "SELECT * FROM courses Where course_code = ?";
    db.query(sql1, [course_code], (err, result) => {
      if (err) {
        console.error("Error checking course code:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
      if (result.length > 0) {
        return res.status(400).json({
          error: "Course code already exists",
        });
      } else {
        const sql =
          "INSERT INTO courses (course_code, course_name, description, credits, teacher_id, max_capacity) VALUES (?, ?, ?, ?, ?, ?)";
        db.query(
          sql,
          [
            course_code,
            course_name,
            description,
            credits,
            teacher_id,
            max_capacity,
          ],
          (err, result) => {
            if (err) {
              console.error("Error adding course:", err);
              return res.status(500).json({ error: "Internal server error" });
            }
            res.status(201).json({
              message: "Course added successfully",
              courseId: result.insertId,
            });
          },
        );
      }
      // Proceed with adding the course
    });
  } catch (error) {
    console.error("Error adding course:", error);
    throw error;
  }
};
