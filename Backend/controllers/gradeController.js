import db from "../config/db.js";

// ============================================================
// CALCULATE LETTER GRADE
// ============================================================

const calculateLetterGrade = (score) => {
  const value = Number(score);

  if (value >= 90) return "A+";
  if (value >= 85) return "A";
  if (value >= 80) return "A-";
  if (value >= 75) return "B+";
  if (value >= 70) return "B";
  if (value >= 65) return "B-";
  if (value >= 60) return "C+";
  if (value >= 55) return "C";
  if (value >= 50) return "C-";
  if (value >= 45) return "D+";
  if (value >= 40) return "D";

  return "F";
};

// ============================================================
// CALCULATE OVERALL SCORE
// ============================================================

const calculateOverall = ({ assignment, quiz, project, midterm, final }) => {
  // We only calculate the overall grade
  // when all five scores exist.

  if (
    assignment === null ||
    assignment === undefined ||
    quiz === null ||
    quiz === undefined ||
    project === null ||
    project === undefined ||
    midterm === null ||
    midterm === undefined ||
    final === null ||
    final === undefined
  ) {
    return null;
  }

  const overall =
    Number(assignment) * 0.1 +
    Number(quiz) * 0.1 +
    Number(project) * 0.1 +
    Number(midterm) * 0.3 +
    Number(final) * 0.4;

  return Number(overall.toFixed(2));
};

// ============================================================
// ADD / UPDATE GRADE
// ============================================================

export const Add_Grade = async (req, res) => {
  try {
    const {
      student_id,
      course_id,
      numeric_grade,
      exam_type,
      semester,
      academic_year,
      recorded_by,
    } = req.body;

    // --------------------------------------------------------
    // VALIDATION
    // --------------------------------------------------------

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
        message: "All required fields are required",
      });
    }

    // --------------------------------------------------------
    // VALID EXAM TYPES
    // --------------------------------------------------------

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

    // --------------------------------------------------------
    // SCORE
    // --------------------------------------------------------

    const score = Number(numeric_grade);

    if (Number.isNaN(score)) {
      return res.status(400).json({
        success: false,
        message: "Numeric grade must be a valid number",
      });
    }

    if (score < 0 || score > 100) {
      return res.status(400).json({
        success: false,
        message: "Numeric grade must be between 0 and 100",
      });
    }

    // --------------------------------------------------------
    // CHECK IF STUDENT + COURSE ROW EXISTS
    // --------------------------------------------------------

    const checkSql = `
      SELECT *
      FROM grades
      WHERE student_id = ?
        AND course_id = ?
        AND semester = ?
        AND academic_year = ?
      LIMIT 1
    `;

    db.query(
      checkSql,
      [Number(student_id), Number(course_id), semester, academic_year],
      (checkErr, rows) => {
        if (checkErr) {
          console.error("Error checking existing grade:", checkErr);

          return res.status(500).json({
            success: false,
            message: "Failed to check existing grade",
            error: checkErr.message,
          });
        }

        // ====================================================
        // ROW DOES NOT EXIST
        // ====================================================

        if (rows.length === 0) {
          const column = exam_type;

          const insertSql = `
            INSERT INTO grades (
              student_id,
              course_id,
              ${column},
              semester,
              academic_year,
              recorded_by
            )
            VALUES (?, ?, ?, ?, ?, ?)
          `;

          db.query(
            insertSql,
            [
              Number(student_id),
              Number(course_id),
              score,
              semester,
              academic_year,
              recorded_by ? Number(recorded_by) : null,
            ],
            (insertErr, result) => {
              if (insertErr) {
                console.error("Error inserting grade:", insertErr);

                return res.status(500).json({
                  success: false,
                  message: "Failed to add grade",
                  error: insertErr.message,
                });
              }

              // New row only has one assessment,
              // therefore overall is still NULL.

              return res.status(201).json({
                success: true,
                message: `${exam_type} grade added successfully`,
                gradeId: result.insertId,
              });
            },
          );

          return;
        }

        // ====================================================
        // ROW ALREADY EXISTS
        // ====================================================

        const existingGrade = rows[0];

        const gradeId = existingGrade.id;

        const updateSql = `
          UPDATE grades
          SET ${exam_type} = ?,
              recorded_by = ?
          WHERE id = ?
        `;

        db.query(
          updateSql,
          [score, recorded_by ? Number(recorded_by) : null, gradeId],
          (updateErr) => {
            if (updateErr) {
              console.error("Error updating grade:", updateErr);

              return res.status(500).json({
                success: false,
                message: "Failed to update grade",
                error: updateErr.message,
              });
            }

            // ------------------------------------------------
            // GET UPDATED ROW
            // ------------------------------------------------

            const selectSql = `
              SELECT *
              FROM grades
              WHERE id = ?
            `;

            db.query(selectSql, [gradeId], (selectErr, updatedRows) => {
              if (selectErr) {
                console.error("Error fetching updated grade:", selectErr);

                return res.status(500).json({
                  success: false,
                  message: "Grade saved but failed to calculate overall",
                  error: selectErr.message,
                });
              }

              const updatedGrade = updatedRows[0];

              // ------------------------------------------------
              // CALCULATE OVERALL
              // ------------------------------------------------

              const overall = calculateOverall({
                assignment: updatedGrade.assignment,

                quiz: updatedGrade.quiz,

                project: updatedGrade.project,

                midterm: updatedGrade.midterm,

                final: updatedGrade.final,
              });

              // ------------------------------------------------
              // NOT COMPLETE YET
              // ------------------------------------------------

              if (overall === null) {
                return res.status(200).json({
                  success: true,
                  message: `${exam_type} grade saved successfully`,
                  gradeId,
                  overall_score: null,
                  grade: null,
                });
              }

              // ------------------------------------------------
              // CALCULATE LETTER GRADE
              // ------------------------------------------------

              const letterGrade = calculateLetterGrade(overall);

              // ------------------------------------------------
              // SAVE OVERALL + LETTER GRADE
              // ------------------------------------------------

              const overallSql = `
                  UPDATE grades
                  SET
                    overall_score = ?,
                    grade = ?
                  WHERE id = ?
                `;

              db.query(
                overallSql,
                [overall, letterGrade, gradeId],
                (overallErr) => {
                  if (overallErr) {
                    console.error("Error saving overall grade:", overallErr);

                    return res.status(500).json({
                      success: false,
                      message: "Scores saved but failed to save overall grade",
                      error: overallErr.message,
                    });
                  }

                  return res.status(200).json({
                    success: true,

                    message: `${exam_type} grade saved successfully`,

                    gradeId,

                    overall_score: overall,

                    grade: letterGrade,
                  });
                },
              );
            });
          },
        );
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
          g.assignment,
          g.quiz,
          g.project,
          g.midterm,
          g.final,
          g.grade,
          g.overall_score,
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
          g.student_id,
          g.assignment,
          g.quiz,
          g.project,
          g.midterm,
          g.final,
          g.grade,
          g.overall_score,
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
          g.student_id,
          g.assignment,
          g.quiz,
          g.project,
          g.midterm,
          g.final,
          g.grade,
          g.overall_score,
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
          g.student_id,
          g.assignment,
          g.quiz,
          g.project,
          g.midterm,
          g.final,
          g.grade,
          g.overall_score,
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
          g.student_id,
          g.assignment,
          g.quiz,
          g.project,
          g.midterm,
          g.final,
          g.grade,
          g.overall_score,
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
          g.assignment,
          g.quiz,
          g.project,
          g.midterm,
          g.final,
          g.grade,
          g.overall_score,
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
          g.assignment,
          g.quiz,
          g.project,
          g.midterm,
          g.final,
          g.grade,
          g.overall_score,
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
          g.assignment,
          g.quiz,
          g.project,
          g.midterm,
          g.final,
          g.grade,
          g.overall_score,
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
          g.assignment,
          g.quiz,
          g.project,
          g.midterm,
          g.final,
          g.grade,
          g.overall_score,
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
