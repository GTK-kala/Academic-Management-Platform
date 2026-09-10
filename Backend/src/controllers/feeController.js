import db from "../config/db.js";

const Get_Fee_Structure = (req, res) => {
  const { userId, userRole } = req.query;
  try {
    if (userRole === "admin") {
      const fee_sql = `SELECT
          f.id,
          f.amount,
          f.course_id,
          f.fee_name,
          c.course_name,
          c.course_code,
          COALESCE(e.total_students, 0) AS total_students,
          COALESCE(e.total_students * f.amount, 0) AS paid_amount,
          COALESCE(e.total_students * f.amount, 0) AS total_amount,
          COALESCE(p.paid_students, 0) AS paid_students,
          COALESCE(p.paid_amount, 0) AS paid_amount,
          CASE
          WHEN COALESCE(p.paid_amount, 0) >= COALESCE(e.total_students * f.amount, 0)
          AND COALESCE(e.total_students, 0) > 0 THEN 'paid'
          WHEN COALESCE(p.paid_amount, 0) > 0 THEN 'partial'
          ELSE 'pending'
          END AS payment_status
          FROM
          fee_structure f
          LEFT JOIN courses c ON f.course_id = c.id
          LEFT JOIN (
          SELECT
          course_id,
          COUNT(DISTINCT student_id) AS total_students
          FROM
          enrollments
          GROUP BY
          course_id
          ) e ON f.course_id = e.course_id
          LEFT JOIN (
          SELECT
          fee_structure_id,
          COUNT(DISTINCT student_id) AS paid_students,
          SUM(amount_paid) AS paid_amount
          FROM
          fee_payments
          GROUP BY
          fee_structure_id
          ) p ON f.id = p.fee_structure_id;`;
      db.query(fee_sql, (err, fee_result) => {
        if (err) {
          console.error("Error fetching fee structures:", err);
          return res.status(500).json({ error: "Internal server error" });
        }
        res.status(200).json({
          message: "Fee structures fetched successfully",
          fee_structure: fee_result,
        });
      });
    } else if (userRole === "student") {
      const fee_sql = `SELECT
          f.*,
          c.course_name,
          c.course_code,
          1 AS total_students,
          f.amount AS total_amount,
          COALESCE(s.paid_students, 0) AS paid_students,
          COALESCE(p.student_paid_amount, 0) AS paid_amount,
          COALESCE(p.payment_status, 'pending') AS payment_status
          FROM
          fee_structure f
          LEFT JOIN courses c ON f.course_id = c.id
          -- Payments made by ALL students for this fee
          LEFT JOIN (
          SELECT
          fee_structure_id,
          COUNT(DISTINCT student_id) AS paid_students,
          SUM(amount_paid) AS paid_amount
          FROM
          fee_payments
          WHERE
          student_id = ?
          GROUP BY
          fee_structure_id
          ) s ON f.id = s.fee_structure_id
          -- Payment information for ONLY the current student
          LEFT JOIN (
          SELECT
          fee_structure_id,
          SUM(amount_paid) AS student_paid_amount,
          MAX(status) AS payment_status
          FROM
          fee_payments
          WHERE
          student_id = ?
          GROUP BY
          fee_structure_id
          ) p ON f.id = p.fee_structure_id
          WHERE
          EXISTS (
          SELECT
          1
          FROM
          enrollments e
          WHERE
          e.course_id = f.course_id
          AND e.student_id = ?
          )`;
      db.query(fee_sql, [userId, userId, userId], (err, fee_result) => {
        if (err) {
          console.error("Error fetching fee structures:", err);
          return res.status(500).json({ error: "Internal server error" });
        }
        res.status(200).json({
          message: "Fee structures fetched successfully",
          fee_structure: fee_result,
        });
      });
    }
  } catch (error) {
    console.error("Error fetching fee structures:", error);
    res.status(500).json({ error: "Failed to fetch fee structures" });
  }
};

const Add_Fee_Structure = (req, res) => {
  const { course_id, fee_name, amount, due_date, academic_session } = req.body;

  const fee_amount = parseFloat(amount);

  try {
    const insert_sql = `INSERT INTO
        fee_structure (
        course_id,
        fee_name,
        amount,
        due_date,
        academic_session
        )
        VALUES
        (?, ?, ?, ?, ?)`;
    db.query(
      insert_sql,
      [course_id, fee_name, fee_amount, due_date, academic_session],
      (err, result) => {
        if (err) {
          console.error("Error adding fee structure:", err);
          return res.status(500).json({ error: "Internal server error" });
        }
        res.status(201).json({
          message: "Fee structure added successfully",
          fee_structure_id: result.insertId,
        });
      },
    );
  } catch (error) {
    console.error("Error adding fee structure:", error);
    res.status(500).json({ error: "Failed to add fee structure" });
  }
};

const Pay_Fee_Structure = (req, res) => {
  const { student_id, fee_structure_id, amount_paid } = req.body;
  try {
    const student_sql = `SELECT
        *
        FROM
        fee_payments
        WHERE
        student_id = ?
        AND fee_structure_id = ?`;
    db.query(
      student_sql,
      [student_id, fee_structure_id],
      (err, student_result) => {
        if (err) {
          console.error("Error checking payment:", err);
          return res.status(500).json({ error: "Internal server error" });
        }
        if (student_result.length > 0) {
          // Update existing payment
          const update_sql = `UPDATE fee_payments
              SET
              amount_paid = amount_paid + ?
              WHERE
              student_id = ?
              AND fee_structure_id = ?
              AND amount_paid + ? <= (
              SELECT
              amount
              FROM
              fee_structure
              WHERE
              id = ?
              )`;

          db.query(
            update_sql,
            [
              amount_paid,
              student_id,
              fee_structure_id,
              amount_paid,
              fee_structure_id,
            ],
            (err, update_result) => {
              if (err) {
                console.error("Error updating payment:", err);

                return res.status(500).json({
                  error: "Internal server error",
                });
              }

              if (update_result.affectedRows === 0) {
                return res.status(400).json({
                  error: "Payment exceeds the fee structure amount",
                });
              }

              return res.status(200).json({
                message: "Payment updated successfully",
              });
            },
          );
        } else {
          // Insert new payment
          const insert_sql = `INSERT INTO
              fee_payments (
              student_id,
              fee_structure_id,
              amount_paid,
              payment_date,
              status
              )
              SELECT
              ?,
              ?,
              ?,
              ?,
              CASE
              WHEN (
              COALESCE(
              (
              SELECT
              SUM(fp.amount_paid)
              FROM
              fee_payments fp
              WHERE
              fp.student_id = ?
              AND fp.fee_structure_id = ?
              ),
              0
              ) + ?
              ) = fs.amount THEN 'paid'
              ELSE 'partial'
              END
              FROM
              fee_structure fs
              WHERE
              fs.id = ?
              AND (
              COALESCE(
              (
              SELECT
              SUM(fp.amount_paid)
              FROM
              fee_payments fp
              WHERE
              fp.student_id = ?
              AND fp.fee_structure_id = fs.id
              ),
              0
              ) + ?
              ) <= fs.amount`;
          db.query(
            insert_sql,
            [
              student_id,
              fee_structure_id,
              amount_paid,
              new Date(),
              student_id,
              fee_structure_id,
              amount_paid,
              fee_structure_id,
              student_id,
              amount_paid,
            ],
            (err, insert_result) => {
              if (err) {
                console.error("Error inserting payment:", err);
                return res.status(500).json({ error: "Internal server error" });
              } else if (insert_result.affectedRows === 0) {
                return res.status(400).json({
                  error: "Payment exceeds the fee structure amount",
                });
              } else {
                res.status(201).json({
                  message: "Payment recorded successfully",
                });
              }
            },
          );
        }
      },
    );
  } catch (error) {
    console.error("Error paying fee structure:", error);
    res.status(500).json({ error: "Failed to pay fee structure" });
  }
};

const Payed_Fee_Structure = (req, res) => {
  const { userId } = req.params;
  const { userRole } = req.query;
  try {
    if (userRole === "admin") {
      const fee_sql = `SELECT
          fp.*,
          fs.amount,
          fs.fee_name
          FROM
          fee_payments fp
          LEFT JOIN fee_structure fs ON fs.id = fp.fee_structure_id
          WHERE
          student_id = ?`;
      db.query(fee_sql, [userId], (err, fee_results) => {
        if (err) {
          console.error("Error inserting payment:", err);
          return res.status(500).json({ error: "Internal server error" });
        } else if (fee_results.length === 0) {
          res.status(200).json({
            message: "No Payed recorded for the student",
          });
        } else {
          res.status(200).json({
            fee_results: fee_results,
          });
        }
      });
    } else {
      return res.status(400).json({
        error: "Payment exceeds the fee structure amount",
      });
    }
  } catch (error) {
    console.error("Error paying fee structure:", error);
    res.status(500).json({ error: "Failed to pay fee structure" });
  }
};

export {
  Get_Fee_Structure,
  Add_Fee_Structure,
  Pay_Fee_Structure,
  Payed_Fee_Structure,
};
