import db from "../config/db.js";

const Get_Fee_Structure = (req, res) => {
  const { userId, userRole } = req.query;
  try {
    if (userRole === "admin") {
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
    } else if (userRole === "student") {
      const fee_sql = `SELECT
          *
          FROM
          fee_structure`;
      db.query(fee_sql, [userId, userRole], (err, fee_result) => {
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

export { Get_Fee_Structure };
