import db from "../config/db.js";

const Get_Teachers = (req, res) => {
  try {
    const teacher_sql = `SELECT * FROM teachers`;
    db.query(teacher_sql, (err, results) => {
      if (err) {
        return res.status(500).json({
          message: "Failed to fetch teachers",
          error: err.message,
        });
      }
      res.status(200).json({
        message: "Teachers fetched successfully",
        teachers: results,
      });
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch  teachers",
      error: error.message,
    });
  }
};

export { Get_Teachers };
