import express from "express";
import {
  Add_Grade,
  Fetch_Grade_All,
  Fetch_Grade_By_Both,
  Fetch_Grade_By_Course,
  Fetch_Grade_By_Student,
} from "../controllers/gradeController.js";
import { VerifyToken } from "../middleware/authMiddleware.js";

const GradeRouters = express.Router();

GradeRouters.post("/add", VerifyToken, Add_Grade);
GradeRouters.get("/grade/course/:courseId", VerifyToken, Fetch_Grade_By_Course);
GradeRouters.get(
  "/grade/student/:studentId",
  VerifyToken,
  Fetch_Grade_By_Student,
);
GradeRouters.get(
  "/grade/course/:courseId/student/:studentId",
  VerifyToken,
  Fetch_Grade_By_Both,
);
GradeRouters.get("/grade/:userId", VerifyToken, Fetch_Grade_All);

export default GradeRouters;
