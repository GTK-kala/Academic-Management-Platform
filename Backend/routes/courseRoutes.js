import express from "express";
import { Add_Course } from "../controllers/courseController.js";

const CourseRouter = express.Router();

CourseRouter.post("/add", Add_Course);

export default CourseRouter;
