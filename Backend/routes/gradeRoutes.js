import express from "express";
import { Add_Grade } from "../controllers/gradeController.js";

const GradeRouters = express.Router();

GradeRouters.post("/add", Add_Grade);

export default GradeRouters;
