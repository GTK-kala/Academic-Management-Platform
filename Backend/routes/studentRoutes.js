import express from "express";
import {
  AddStudent,
  getRecentStudents,
} from "../controllers/studentController.js";
import { VerifyToken, VerifyUser } from "../middleware/authMiddleware.js";

const StudentRouters = express.Router();

StudentRouters.post("/add", VerifyToken, VerifyUser, AddStudent);
StudentRouters.get("/recent", VerifyToken, VerifyUser, getRecentStudents);

export default StudentRouters;
