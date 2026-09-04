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
        const sql = `INSERT INTO
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
  const token = req.cookies.token;
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
          token: token,
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

export const Edit_Course = (req, res) => {
  const { courseId } = req.params;
  const {
    course_code,
    course_name,
    description,
    credits,
    teacher_id,
    max_capacity,
  } = req.body;
  let fields = [];
  let values = [];
  try {
    if (course_code !== undefined) {
      fields.push("course_code = ?");
      values.push(course_code);
    }
    if (course_name !== undefined) {
      fields.push("course_name = ?");
      values.push(course_name);
    }
    if (description !== undefined) {
      fields.push("description = ?");
      values.push(description);
    }
    if (credits !== undefined) {
      fields.push("credits = ?");
      values.push(credits);
    }
    if (teacher_id !== undefined) {
      fields.push("teacher_id = ?");
      values.push(teacher_id);
    }
    if (max_capacity !== undefined) {
      fields.push("max_capacity = ?");
      values.push(max_capacity);
    }
    values.push(courseId);

    const edit_sql = `
       UPDATE courses
       SET ${fields.join(", ")}
       WHERE id = ?
     `;

    db.query(edit_sql, values, (err, result) => {
      if (err) {
        return res.status(500).json({
          message: err,
        });
      } else {
        return res.status(200).json({
          message: "course info updated !!!",
          result: result[0],
        });
      }
    });
  } catch (error) {
    console.error("Error editing course:", error);
    throw error;
  }
};
