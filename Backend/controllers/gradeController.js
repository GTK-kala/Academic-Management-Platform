import db from "../config/db.js";

// Add a new grade
export const Add_Grade = (req, res) => {
  const { userRole } = req.query;
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
    const add_query = `INSERT INTO
        grades (
        student_id,
        course_id,
        grade,
        numeric_grade,
        exam_type,
        semester,
        academic_year,
        recorded_by
        )
        VALUES
        (?, ?, ?, ?, ?, ?, ?, ?)`;
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

// Fetch All Grade

export const Fetch_Grade_All = (req, res) => {
  const { userId } = req.params;
  const { userRole } = req.query;
  try {
    if (userRole === "admin") {
      const fetch_sql = `SELECT
          s.first_name,
          s.last_name,
          c.course_name,
          g.exam_type,
          g.grade,
          g.numeric_grade,
          g.semester
          FROM
          grades g
          LEFT JOIN students s ON g.student_id = s.id
          LEFT JOIN teachers t ON g.recorded_by = t.id
          LEFT JOIN courses c ON g.course_id = c.id`;
      db.query(fetch_sql, (err, results) => {
        if (err) {
          console.error("Error fetching grade:", err);
          return res.status(500).json({ error: "Failed to fetch grade" });
        } else if (results.length > 0) {
          res.status(201).json({
            message: "Grade fetched successfully",
            grades: results,
          });
        } else {
          res.status(201).json({
            message: "Error fetching grade",
            grades: [],
          });
        }
      });
    } else if (userRole === "teacher") {
      const fetch_sql = `SELECT
          s.first_name,
          s.last_name,
          c.course_name,
          g.exam_type,
          g.grade,
          g.numeric_grade,
          g.semester
          FROM
          grades g
          LEFT JOIN students s ON g.student_id = s.id
          LEFT JOIN teachers t ON g.recorded_by = t.id
          LEFT JOIN courses c ON g.course_id = c.id
          WHERE
          g.recorded_by = ?`;
      db.query(fetch_sql, [userId], (err, results) => {
        if (err) {
          console.error("Error fetching grade:", err);
          return res.status(500).json({ error: "Failed to fetch grade" });
        } else if (results.length > 0) {
          res.status(201).json({
            message: "Grade fetched successfully",
            grades: results,
          });
        } else {
          res.status(201).json({
            message: "Error fetching grade",
            grades: [],
          });
        }
      });
    } else {
      const fetch_sql = `SELECT
          s.first_name,
          s.last_name,
          c.course_name,
          g.exam_type,
          g.grade,
          g.numeric_grade,
          g.semester
          FROM
          grades g
          LEFT JOIN students s ON g.student_id = s.id
          LEFT JOIN teachers t ON g.recorded_by = t.id
          LEFT JOIN courses c ON g.course_id = c.id WHERE g.student_id = ?`;
      db.query(fetch_sql, [userId], (err, results) => {
        if (err) {
          console.error("Error fetching grade:", err);
          return res.status(500).json({ error: "Failed to fetch grade" });
        } else if (results.length > 0) {
          res.status(201).json({
            message: "Grade fetched successfully",
            grades: results,
          });
        } else {
          res.status(201).json({
            message: "Error fetching grade",
            grades: [],
          });
        }
      });
    }
  } catch (error) {
    console.error("Error fetching grade:", error);
    res.status(500).json({ error: "Failed to fetch grade" });
  }
};

// Fetch Grade by Course Id

export const Fetch_Grade_By_Course = (req, res) => {
  const { courseId } = req.params;
  const { userRole, userId } = req.query;
  try {
    if (userRole === "admin" || userRole === "teacher") {
      const course_sql = `SELECT
        s.first_name,
        s.last_name,
        c.course_name,
        g.course_id,
        g.exam_type,
        g.grade,
        g.numeric_grade,
        g.semester
        FROM
        grades g
        LEFT JOIN students s ON g.student_id = s.id
        LEFT JOIN teachers t ON g.recorded_by = t.id
        LEFT JOIN courses c ON g.course_id = c.id
        WHERE
        g.course_id = ?`;
      db.query(course_sql, [courseId], (err, results) => {
        if (err) {
          console.error("Error fetching grade:", err);
          return res.status(500).json({ error: "Failed to fetch grade" });
        } else if (results.length > 0) {
          res.status(201).json({
            message: "Grade fetched successfully",
            grades: results,
          });
        } else {
          res.status(201).json({
            message: "Error fetching grade",
            grades: [],
          });
        }
      });
    } else {
      const course_sql = `SELECT
        s.first_name,
        s.last_name,
        c.course_name,
        g.course_id,
        g.exam_type,
        g.grade,
        g.numeric_grade,
        g.semester
        FROM
        grades g
        LEFT JOIN students s ON g.student_id = s.id
        LEFT JOIN teachers t ON g.recorded_by = t.id
        LEFT JOIN courses c ON g.course_id = c.id
        WHERE
        g.course_id = ? AND g.student_id = ?`;
      db.query(course_sql, [courseId, userId], (err, results) => {
        if (err) {
          console.error("Error fetching grade:", err);
          return res.status(500).json({ error: "Failed to fetch grade" });
        } else if (results.length > 0) {
          res.status(201).json({
            message: "Grade fetched successfully",
            grades: results,
          });
        } else {
          res.status(201).json({
            message: "Error fetching grade",
            grades: [],
          });
        }
      });
    }
  } catch (error) {
    console.error("Error fetching grade:", error);
    res.status(500).json({ error: "Failed to fetch grade" });
  }
};

// Fetch Grade by Student Id

export const Fetch_Grade_By_Student = (req, res) => {
  const { studentId } = req.params;
  const { userRole, userId } = req.query;
  try {
    if (userRole === "admin") {
      const student_sql = `SELECT
          s.first_name,
          s.last_name,
          c.course_name,
          g.student_id,
          g.exam_type,
          g.grade,
          g.numeric_grade,
          g.semester
          FROM
          grades g
          LEFT JOIN students s ON g.student_id = s.id
          LEFT JOIN teachers t ON g.recorded_by = t.id
          LEFT JOIN courses c ON g.course_id = c.id
          WHERE
          g.student_id = ?`;
      db.query(student_sql, [studentId], (err, results) => {
        if (err) {
          console.error("Error fetching grade:", err);
          return res.status(500).json({ error: "Failed to fetch grade" });
        } else if (results.length > 0) {
          res.status(201).json({
            message: "Grade fetched successfully",
            grades: results,
          });
        } else {
          res.status(201).json({
            message: "Error fetching grade",
            grades: [],
          });
        }
      });
    } else if (userRole === "teacher") {
      const student_sql = `SELECT
          s.first_name,
          s.last_name,
          c.course_name,
          g.student_id,
          g.course_id,
          g.exam_type,
          g.grade,
          g.numeric_grade,
          g.semester
          FROM
          grades g
          JOIN teachers t ON g.recorded_by = t.id
          JOIN courses c ON g.course_id = c.id
          JOIN students s ON g.student_id = s.id
          WHERE
          g.student_id = ?
          AND t.id = ?`;
      db.query(student_sql, [studentId, userId], (err, results) => {
        if (err) {
          console.error("Error fetching grade:", err);
          return res.status(500).json({ error: "Failed to fetch grade" });
        } else if (results.length > 0) {
          res.status(201).json({
            message: "Grade fetched successfully",
            grades: results,
          });
        } else {
          res.status(201).json({
            message: "Error fetching grade",
            grades: [],
          });
        }
      });
    }
  } catch (error) {
    console.error("Error fetching grade:", error);
    res.status(500).json({ error: "Failed to fetch grade" });
  }
};

// Fetch Grade By Both Student and Course Id

export const Fetch_Grade_By_Both = (req, res) => {
  const { courseId, studentId } = req.params;
  try {
    const grade_sql = `SELECT
        s.first_name,
        s.last_name,
        c.course_name,
        g.student_id,
        g.course_id,
        g.exam_type,
        g.grade,
        g.numeric_grade,
        g.semester
        FROM
        grades g
        LEFT JOIN students s ON g.student_id = s.id
        LEFT JOIN teachers t ON g.recorded_by = t.id
        LEFT JOIN courses c ON g.course_id = c.id
        WHERE
        g.course_id = ?
        AND g.student_id = ?`;
    db.query(grade_sql, [courseId, studentId], (err, results) => {
      if (err) {
        console.error("Error fetching grade:", err);
        return res.status(500).json({ error: "Failed to fetch grade" });
      } else if (results.length > 0) {
        res.status(201).json({
          message: "Grade fetched successfully",
          grades: results,
        });
      } else {
        res.status(201).json({
          message: "Error fetching grade",
          grades: [],
        });
      }
    });
  } catch (error) {
    console.error("Error fetching grade:", error);
    res.status(500).json({ error: "Failed to fetch grade" });
  }
};
