import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import db from "./config/db.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import UserRoutes from "./routes/userRoutes.js";
import GradeRouters from "./routes/gradeRoutes.js";
import CourseRoutes from "./routes/courseRoutes.js";
import StudentRoutes from "./routes/studentRoutes.js";
import TeacherRoutes from "./routes/teacherRoutes.js";
import EnrollmentRoutes from "./routes/enrollmentRoutes.js";
import AttendanceRouter from "./routes/attendanceRoutes.js";

dotenv.config();
const app = express();
const port = process.env.PORT;

const allowedOrigins = ["http://localhost:3000", process.env.VITE_FRONTEND_URL];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (origin.endsWith(".vercel.app")) return callback(null, true);

      if (allowedOrigins.includes(origin)) return callback(null, true);

      return callback(new Error("Not allowed by CORS"));
    },

    credentials: true,
  }),
);

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

////// Routes///////////////////

app.use("/users", UserRoutes);
app.use("/grades", GradeRouters);
app.use("/api/auth", UserRoutes);
app.use("/courses", CourseRoutes);
app.use("/students", StudentRoutes);
app.use("/teachers", TeacherRoutes);
app.use("/enrollments", EnrollmentRoutes);
app.use("/attendances", AttendanceRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});
