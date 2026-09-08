import db from "../config/db.js";

const Get_Fee_Structure = (req, res) => {
  const { userId, userRole } = req.query;
  try {
    if (userRole === "admin") {
      const fee_sql = `SELECT
          f.*,
          c.course_name,
          COALESCE(s.paid_students, 0) AS paid_students,
          COALESCE(e.total_students, 0) AS total_students,
          COALESCE(s.paid_amount, 0) AS paid_amount
          FROM
          fee_structure f
          LEFT JOIN courses c ON f.course_id = c.id
          LEFT JOIN (
          SELECT
          fee_structure_id,
          COUNT(DISTINCT student_id) AS paid_students,
          SUM(amount_paid) AS paid_amount
          FROM
          fee_payments
          GROUP BY
          fee_structure_id
          ) s ON f.id = s.fee_structure_id
          LEFT JOIN (
          SELECT
          course_id,
          COUNT(DISTINCT student_id) AS total_students
          FROM
          enrollments
          GROUP BY
          course_id
          ) e ON f.course_id = e.course_id`;
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
          *
          FROM
          fee_structure`;
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
            AND fee_structure_id = ?`;
          db.query(
            update_sql,
            [amount_paid, student_id, fee_structure_id],
            (err, update_result) => {
              if (err) {
                console.error("Error updating payment:", err);
                return res.status(500).json({ error: "Internal server error" });
              }
              res.status(200).json({
                message: "Payment updated successfully",
              });
            },
          );
        } else {
          // Insert new payment
          const insert_sql = `INSERT INTO
            fee_payments (student_id, fee_structure_id, amount_paid, payment_date)
            VALUES
            (?, ?, ?, ?)`;
          db.query(
            insert_sql,
            [student_id, fee_structure_id, amount_paid, new Date()],
            (err, insert_result) => {
              if (err) {
                console.error("Error inserting payment:", err);
                return res.status(500).json({ error: "Internal server error" });
              }
              res.status(201).json({
                message: "Payment recorded successfully",
                payment_id: insert_result.insertId,
              });
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

export { Get_Fee_Structure, Add_Fee_Structure, Pay_Fee_Structure };
