import express from "express";
import {
  Add_Student,
  Get_Student,
  Get_Students,
  Edit_Student,
} from "../controllers/studentController.js";
import { VerifyToken, VerifyUser } from "../middleware/authMiddleware.js";

const StudentRouters = express.Router();

StudentRouters.get("/all/:userId", VerifyToken, Get_Students);
StudentRouters.put("/edit/:studentId", VerifyToken, Edit_Student);
StudentRouters.get("/student/:studentId", VerifyToken, Get_Student);
// StudentRouters.get("/recent", Get_Recent_Students);
StudentRouters.post("/add", VerifyToken, VerifyUser, Add_Student);

export default StudentRouters;
