import express from "express";

import { Enroll_Course } from "../controllers/enrollmentController.js";

const EnrollmentRouter = express.Router();

EnrollmentRouter.post("/enroll", Enroll_Course);

export default EnrollmentRouter;
