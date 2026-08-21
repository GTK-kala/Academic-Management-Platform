import express from "express";
import {
  Add_Grade,
  Fetch_Grade_All,
  Fetch_Grade_By_Student,
} from "../controllers/gradeController.js";

const GradeRouters = express.Router();

GradeRouters.post("/add", Add_Grade);
GradeRouters.get("/grade/:studentId", Fetch_Grade_By_Student);
GradeRouters.get("/grade/:courseId", Fetch_Grade_By_Student);
GradeRouters.get("/grade", Fetch_Grade_All);

export default GradeRouters;
