import express from "express";
import { AddStudent, Get_Students } from "../controllers/studentController.js";
import { VerifyToken, VerifyUser } from "../middleware/authMiddleware.js";

const StudentRouters = express.Router();

StudentRouters.get("/all/:userId", Get_Students);
// StudentRouters.get("/recent", Get_Recent_Students);
StudentRouters.post("/add", VerifyToken, VerifyUser, AddStudent);

export default StudentRouters;
