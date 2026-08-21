import express from "express";
import { Add_Grade, Fetch_Grade } from "../controllers/gradeController.js";

const GradeRouters = express.Router();

GradeRouters.post("/add", Add_Grade);
GradeRouters.get("/grade", Fetch_Grade);

export default GradeRouters;
