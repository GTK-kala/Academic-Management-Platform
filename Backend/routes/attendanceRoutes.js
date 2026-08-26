import express from "express";
import { Get_Attendances } from "../controllers/attendanceController.js";

const AttendanceRouter = express.Router();

AttendanceRouter.get("/all", Get_Attendances);

export default AttendanceRouter;
