import express from "express";
import {
  AddStudent,
  Get_Students,
  Get_Student,
} from "../controllers/studentController.js";
import { VerifyToken, VerifyUser } from "../middleware/authMiddleware.js";

const StudentRouters = express.Router();

StudentRouters.get("/all/:userId", Get_Students);
StudentRouters.get("/student/:studentId", Get_Student);
// StudentRouters.get("/recent", Get_Recent_Students);
StudentRouters.post("/add", VerifyToken, VerifyUser, AddStudent);

export default StudentRouters;
