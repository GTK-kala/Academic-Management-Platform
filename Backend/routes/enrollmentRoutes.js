import express from "express";

import {
  Enroll_Course,
  Get_Enrolled_Courses,
} from "../controllers/enrollmentController.js";
import { VerifyToken } from "../middleware/authMiddleware.js";

const EnrollmentRouter = express.Router();

EnrollmentRouter.post("/enroll", Enroll_Course);
EnrollmentRouter.get("/enrolled/:userId", Get_Enrolled_Courses);

export default EnrollmentRouter;
