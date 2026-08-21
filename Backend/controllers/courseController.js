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
    const sql1 = `SELECT
        *
        FROM
        courses
        WHERE
        course_code = ?`;
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
          `INSERT INTO
              courses (
              course_code,
              course_name,
              description,
              credits,
              teacher_id,
              max_capacity
              )
              VALUES
              (?, ?, ?, ?, ?, ?)`;
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

export const Get_Courses = async (req, res) => {
  const userId = req.params.userId;
  try {
    const sql = `SELECT
        c.id,
        c.course_code,
        c.course_name,
        c.description,
        c.teacher_id,
        c.credits,
        CONCAT (t.first_name, ' ', t.last_name) AS teacher_name,
        c.count,
        c.max_capacity,
        t.department,
        e.course_id AS enrollment_id
        FROM
        courses c
        LEFT JOIN teachers t ON c.teacher_id = t.id
        LEFT JOIN enrollments e ON c.id = e.course_id
        AND e.student_id = ?`;
    db.query(sql, [userId], (err, result) => {
      if (err) {
        console.error("Error fetching courses:", err);
        return res.status(500).json({
          error: "Internal server error",
        });
      } else {
        res.status(200).json({
          courses: result,
        });
      }
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw error;
  }
};

export const Get_Course = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const sql = `SELECT
        c.id,
        c.course_code,
        c.course_name,
        c.description,
        c.credits,
        c.count,
        CONCAT (t.first_name, ' ', t.last_name) AS teacher_name,
        c.max_capacity,
        t.department
        FROM
        courses c
        LEFT JOIN teachers t ON c.teacher_id = t.id
        WHERE
        c.id = ?`;
    db.query(sql, [courseId], (err, result) => {
      if (err) {
        console.error("Error fetching course:", err);
        return res.status(500).json({
          error: "Internal server error",
        });
      }
      if (result.length === 0) {
        return res.status(404).json({
          error: "Course not found",
        });
      } else {
        res.status(200).json({
          course: result[0],
        });
      }
    });
  } catch (error) {
    console.error("Error fetching course:", error);
    throw error;
  }
};
