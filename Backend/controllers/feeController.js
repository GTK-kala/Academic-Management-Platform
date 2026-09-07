import db from "../config/db.js";

const Get_Fee_Structure = (req, res) => {
  const { userId, userRole } = req.query;
  try {
    if (userRole === "admin") {
      const fee_sql = `SELECT
          f.*,
          c.course_name,
          SUM(fp.amount_paid) OVER () AS paid_amount
          FROM
          fee_structure f
          LEFT JOIN courses c ON f.course_id = c.id
          LEFT JOIN fee_payments fp ON f.id = fp.fee_structure_id`;
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
export { Get_Fee_Structure, Add_Fee_Structure };
