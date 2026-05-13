import db from "../config/db.js";

const AddStudent = (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      dateOfBirth,
      gender,
      phone,
      address,
    } = req.body;
    const sql = "SELECT * FROM students WHERE email = ?";
    db.query(sql, [email], (err, results) => {
      if (err) {
        return res.status(500).json({
          message: "Failed to check email",
          error: err.message,
        });
      }
      if (results.length > 0) {
        return res.status(400).json({
          message: "Student already exists",
        });
      } else {
        const sql2 =
          "INSERT INTO students (first_name, last_name, email, password, date_of_birth,gender, phone,address, enrollment_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        db.query(
          sql2,
          [
            firstName,
            lastName,
            email,
            password,
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
