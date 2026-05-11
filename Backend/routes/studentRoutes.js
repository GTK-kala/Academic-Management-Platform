import express from "express";
import { AddStudent } from "../controllers/studentController.js";
import { VerifyToken, VerifyUser } from "../middleware/authMiddleware.js";

const StudentRouters = express.Router();

StudentRouters.post("/add", VerifyToken, VerifyUser, AddStudent);

export default StudentRouters;
