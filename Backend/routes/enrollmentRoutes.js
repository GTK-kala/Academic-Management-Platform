import express from "express";

import {
  Enroll_Course,
  Get_Enrolled_Courses,
} from "../controllers/enrollmentController.js";

const EnrollmentRouter = express.Router();

EnrollmentRouter.post("/enroll", Enroll_Course);
EnrollmentRouter.get("/enrolled-courses/:studentId", Get_Enrolled_Courses);

export default EnrollmentRouter;
