import db from "../config/db.js";

const AddStudent = () => {
  try {
    const { firstName, lastName, dateOfBirth, gender, address, phone } =
      req.body;
    const sql = "SELECT * FROM users WHERE phone = ?";
    db.query(sql, [phone], (err, results) => {
      if (err) {
        return res.status(500).json({
          message: "Failed to check phone",
          error: err.message,
        });
      }
      if (results.length > 0) {
        return res.status(400).json({
          message: "Student already exists",
        });
      } else {
        const sql2 =
          "INSERT INTO users (first_name, last_name,date_of_birth,gender,address,phone, enrollment_date ) VALUES (?, ?, ?, ?, ?, ?)";
        db.query(
          sql2,
          [
            firstName,
            lastName,
            dateOfBirth,
            gender,
            address,
            phone,
            new Date().getDate(),
          ],
          (err, results) => {
            if (err) {
              return res.status(500).json({
                message: "Failed to create student",
                error: err.message,
              });
            }
            return res.status(201).json({
              message: "Student created successfully",
            });
          },
        );
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export { AddStudent };
