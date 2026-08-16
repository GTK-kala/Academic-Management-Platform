import express from "express";
import {
  Add_Course,
  Get_Courses,
  Get_Course,
} from "../controllers/courseController.js";

const CourseRouter = express.Router();

CourseRouter.post("/add", Add_Course);
CourseRouter.get("/detail/:id", Get_Course);
CourseRouter.get("/list/:studentId", Get_Courses);

export default CourseRouter;
