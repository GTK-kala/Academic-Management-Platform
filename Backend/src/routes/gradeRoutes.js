import express from "express";
import {
  Add_Grade,
  Get_Grade_All,
  Get_Grade_One,
  Get_Grade_By_Both,
  Get_Grade_By_Course,
  Get_Grade_By_Student,
} from "../controllers/gradeController.js";
import { VerifyToken } from "../middleware/authMiddleware.js";

const GradeRouters = express.Router();

GradeRouters.post("/add", VerifyToken, Add_Grade);
GradeRouters.get("/grade/course/:courseId", VerifyToken, Get_Grade_By_Course);
GradeRouters.get(
  "/grade/student/:studentId",
  VerifyToken,
  Get_Grade_By_Student,
);
GradeRouters.get(
  "/grade/course/:courseId/student/:studentId",
  VerifyToken,
  Get_Grade_By_Both,
);
GradeRouters.get("/grade/:courseId", VerifyToken, Get_Grade_One);
GradeRouters.get("/grade/:userId", VerifyToken, Get_Grade_All);

export default GradeRouters;
