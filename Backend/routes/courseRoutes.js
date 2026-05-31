import express from "express";
import { Add_Course, Get_Courses } from "../controllers/courseController.js";

const CourseRouter = express.Router();

CourseRouter.post("/add", Add_Course);
CourseRouter.get("/list", Get_Courses);

export default CourseRouter;
