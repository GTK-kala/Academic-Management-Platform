import express from "express";
import { AddStudent } from "../controllers/studentController.js";
import { VerifyToken } from "../middleware/authMiddleware.js";

const StudentRouters = express.Router();

StudentRouters.post("/add", VerifyToken, AddStudent);

export default StudentRouters;
