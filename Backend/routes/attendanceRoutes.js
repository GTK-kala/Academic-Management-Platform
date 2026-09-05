import express from "express";
import {
  Get_Attendances,
  Add_Attendances,
} from "../controllers/attendanceController.js";
import { VerifyToken } from "../middleware/authMiddleware.js";

const AttendanceRouter = express.Router();

AttendanceRouter.get("/all", VerifyToken, Get_Attendances);
AttendanceRouter.post("/add", VerifyToken, Add_Attendances);

export default AttendanceRouter;
