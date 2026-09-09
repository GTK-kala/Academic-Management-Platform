import express from "express";

import {
  Enroll_Course,
  Get_Enrolled_Courses,
} from "../controllers/enrollmentController.js";
import { VerifyToken } from "../middleware/authMiddleware.js";

const EnrollmentRouter = express.Router();

EnrollmentRouter.post("/enroll", VerifyToken, Enroll_Course);
EnrollmentRouter.get("/enrolled/:userId", VerifyToken, Get_Enrolled_Courses);

export default EnrollmentRouter;
