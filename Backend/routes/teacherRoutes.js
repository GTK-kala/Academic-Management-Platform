import express from "express";
import { Get_Teachers } from "../controllers/teacherController.js";

const TeacherRoutes = express.Router();

TeacherRoutes.get("/all", Get_Teachers);

export default TeacherRoutes;
