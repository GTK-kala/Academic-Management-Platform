import db from "../config/db.js";

// ======================================================
// CALCULATE LETTER GRADE
// ======================================================

const calculateLetterGrade = (score) => {
  const numericScore = Number(score);

  if (numericScore >= 90) return "A+";
  if (numericScore >= 85) return "A";
  if (numericScore >= 80) return "A-";
  if (numericScore >= 75) return "B+";
  if (numericScore >= 70) return "B";
  if (numericScore >= 65) return "B-";
  if (numericScore >= 60) return "C+";
  if (numericScore >= 55) return "C";
  if (numericScore >= 50) return "C-";
  if (numericScore >= 45) return "D+";
  if (numericScore >= 40) return "D";

  return "F";
};

// ======================================================
// ADD GRADE
// ======================================================

export const Add_Grade = async (req, res) => {
  const {
    student_id,
    course_id,
    numeric_grade,
    exam_type,
    semester,
    academic_year,
    recorded_by,
  } = req.body;

  try {
    // ----------------------------------------------
    // VALIDATE REQUIRED FIELDS
    // ----------------------------------------------

    if (
      !student_id ||
      !course_id ||
      numeric_grade === undefined ||
      numeric_grade === null ||
      !exam_type ||
      !semester ||
      !academic_year
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    // ----------------------------------------------
    // VALIDATE NUMERIC GRADE
    // ----------------------------------------------

    const score = Number(numeric_grade);

    if (Number.isNaN(score) || score < 0 || score > 100) {
      return res.status(400).json({
        success: false,
        message: "Numeric grade must be between 0 and 100",
      });
    }

    // ----------------------------------------------
    // VALIDATE EXAM TYPE
    // ----------------------------------------------

    const validExamTypes = [
      "assignment",
      "quiz",
      "project",
      "midterm",
      "final",
    ];

    if (!validExamTypes.includes(exam_type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid exam type",
      });
    }

    // ----------------------------------------------
    // CALCULATE LETTER GRADE
    // ----------------------------------------------

    const grade = calculateLetterGrade(score);

    // ----------------------------------------------
    // INSERT GRADE
    // ----------------------------------------------

    const add_query = `
      INSERT INTO grades (
        student_id,
        course_id,
        grade,
        numeric_grade,
        exam_type,
        semester,
        academic_year,
        recorded_by
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      add_query,
      [
        student_id,
        course_id,
        grade,
        score,
        exam_type,
        semester,
        academic_year,
        recorded_by || null,
      ],
      (err, result) => {
        if (err) {
          console.error("Error adding grade:", err);

          // ------------------------------------------
          // DUPLICATE GRADE
          // ------------------------------------------

          if (err.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
              success: false,
              message: `A ${exam_type} grade already exists for this student and course.`,
            });
          }

          return res.status(500).json({
            success: false,
            message: "Failed to add grade",
            error: err.message,
          });
        }

        // ------------------------------------------
        // SUCCESS
        // ------------------------------------------

        return res.status(201).json({
          success: true,
          message: "Grade added successfully",

          gradeId: result.insertId,

          grade: grade,

          numeric_grade: score,

          exam_type: exam_type,
        });
      },
    );
  } catch (error) {
    console.error("Error adding grade:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add grade",
      error: error.message,
    });
  }
};

// ======================================================
// GET OVERALL GRADE
// ======================================================

export const Get_Overall_Grade = async (req, res) => {
  const { student_id, course_id } = req.params;

  try {
    // ==================================================
    // GET ALL FIVE ASSESSMENTS
    // ==================================================

    const sql = `
      SELECT

        student_id,

        course_id,


        MAX(
          CASE
            WHEN exam_type = 'assignment'
            THEN numeric_grade
          END
        ) AS assignment_score,


        MAX(
          CASE
            WHEN exam_type = 'quiz'
            THEN numeric_grade
          END
        ) AS quiz_score,


        MAX(
          CASE
            WHEN exam_type = 'project'
            THEN numeric_grade
          END
        ) AS project_score,


        MAX(
          CASE
            WHEN exam_type = 'midterm'
            THEN numeric_grade
          END
        ) AS midterm_score,


        MAX(
          CASE
            WHEN exam_type = 'final'
            THEN numeric_grade
          END
        ) AS final_score


      FROM grades


      WHERE student_id = ?

      AND course_id = ?


      GROUP BY
        student_id,
        course_id
    `;

    db.query(sql, [student_id, course_id], (err, results) => {
      if (err) {
        console.error("Error getting overall grade:", err);

        return res.status(500).json({
          success: false,
          message: "Failed to calculate overall grade",
          error: err.message,
        });
      }

      // ==================================================
      // NO GRADES
      // ==================================================

      if (results.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No grades found for this student and course",
        });
      }

      const data = results[0];

      // ==================================================
      // KEEP NULL WHEN ASSESSMENT DOES NOT EXIST
      // ==================================================

      const assignment =
        data.assignment_score !== null ? Number(data.assignment_score) : null;

      const quiz = data.quiz_score !== null ? Number(data.quiz_score) : null;

      const project =
        data.project_score !== null ? Number(data.project_score) : null;

      const midterm =
        data.midterm_score !== null ? Number(data.midterm_score) : null;

      const finalExam =
        data.final_score !== null ? Number(data.final_score) : null;

      // ==================================================
      // CHECK ALL ASSESSMENTS
      // ==================================================

      const allAssessmentsAvailable =
        assignment !== null &&
        quiz !== null &&
        project !== null &&
        midterm !== null &&
        finalExam !== null;

      // ==================================================
      // IF NOT ALL ASSESSMENTS EXIST
      // ==================================================

      if (!allAssessmentsAvailable) {
        return res.status(200).json({
          success: true,

          student_id: student_id,

          course_id: course_id,

          assessments: {
            assignment: assignment,

            quiz: quiz,

            project: project,

            midterm: midterm,

            final: finalExam,
          },

          weights: {
            assignment: "10%",

            quiz: "10%",

            project: "10%",

            midterm: "30%",

            final: "40%",
          },

          overall_score: null,

          overall_grade: null,

          status: "Pending",

          message:
            "Overall grade will be calculated after all five assessments are entered.",
        });
      }

      // ==================================================
      // CALCULATE WEIGHTED SCORES
      // ==================================================

      const assignmentWeighted = assignment * 0.1;

      const quizWeighted = quiz * 0.1;

      const projectWeighted = project * 0.1;

      const midtermWeighted = midterm * 0.3;

      const finalWeighted = finalExam * 0.4;

      // ==================================================
      // CALCULATE OVERALL SCORE
      // ==================================================

      const overallScore =
        assignmentWeighted +
        quizWeighted +
        projectWeighted +
        midtermWeighted +
        finalWeighted;

      // ==================================================
      // CALCULATE FINAL LETTER GRADE
      // ==================================================

      const overallGrade = calculateLetterGrade(overallScore);

      // ==================================================
      // RETURN RESULT
      // ==================================================

      return res.status(200).json({
        success: true,

        student_id: student_id,

        course_id: course_id,

        assessments: {
          assignment: assignment,

          quiz: quiz,

          project: project,

          midterm: midterm,

          final: finalExam,
        },

        weights: {
          assignment: "10%",

          quiz: "10%",

          project: "10%",

          midterm: "30%",

          final: "40%",
        },

        weighted_scores: {
          assignment: Number(assignmentWeighted.toFixed(2)),

          quiz: Number(quizWeighted.toFixed(2)),

          project: Number(projectWeighted.toFixed(2)),

          midterm: Number(midtermWeighted.toFixed(2)),

          final: Number(finalWeighted.toFixed(2)),
        },

        overall_score: Number(overallScore.toFixed(2)),

        overall_grade: overallGrade,

        status: "Completed",
      });
    });
  } catch (error) {
    console.error("Error calculating overall grade:", error);

    return res.status(500).json({
      success: false,

      message: "Failed to calculate overall grade",

      error: error.message,
    });
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
          g.student_id,
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
          g.student_id,
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
          g.student_id,
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
          g.student_id,
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
          g.student_id,
          g.exam_type,
          g.grade,
          g.numeric_grade,
          g.student_id,
          g.semester
          FROM
          grades g
          LEFT JOIN students s ON g.student_id = s.id
          LEFT JOIN teachers t ON g.recorded_by = t.id
          LEFT JOIN courses c ON g.course_id = c.id
          WHERE
          g.course_id = ?
          AND g.student_id = ?`;
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
          g.student_id,
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
          g.student_id,
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
    } else if (userRole === "student") {
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
