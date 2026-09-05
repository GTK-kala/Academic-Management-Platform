import express from "express";
import { Get_Teachers } from "../controllers/teacherController.js";
import { VerifyToken } from "../middleware/authMiddleware.js";

const TeacherRoutes = express.Router();

TeacherRoutes.get("/all", Get_Teachers);

export default TeacherRoutes;
