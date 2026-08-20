import db from "../config/db.js";

// Add a new grade
export const Add_Grade = (req, res) => {
  const {
    student_id,
    course_id,
    grade,
    numeric_grade,
    exam_type,
    semester,
    academic_year,
    recorded_by,
  } = req.body;
  try {
    const add_query = `INSERT INTO grades (student_id, course_id, grade, numeric_grade, exam_type, semester, academic_year, recorded_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    db.query(
      add_query,
      [
        student_id,
        course_id,
        grade,
        numeric_grade,
        exam_type,
        semester,
        academic_year,
        recorded_by,
      ],
      (err, result) => {
        if (err) {
          console.error("Error adding grade:", err);
          return res.status(500).json({ error: "Failed to add grade" });
        }
        res.status(201).json({
          message: "Grade added successfully",
          gradeId: result.insertId,
        });
      },
    );
  } catch (error) {
    console.error("Error adding grade:", error);
    res.status(500).json({ error: "Failed to add grade" });
  }
};
