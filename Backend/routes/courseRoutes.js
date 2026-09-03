import express from "express";
import {
  Add_Course,
  Get_Courses,
  Get_Course,
  Edit_Course,
} from "../controllers/courseController.js";
import { VerifyToken } from "../middleware/authMiddleware.js";

const CourseRouter = express.Router();

CourseRouter.post("/add", VerifyToken, Add_Course);
CourseRouter.get("/list/:userId", VerifyToken, Get_Courses);
CourseRouter.get("/detail/:courseId", VerifyToken, Get_Course);
CourseRouter.put("/edit/:courseId", VerifyToken, Edit_Course);

export default CourseRouter;
