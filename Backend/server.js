import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import db from "./config/db.js";
import bodyParser from "body-parser";
import UserRoutes from "./routes/userRoutes.js";

dotenv.config();
const app = express();
const port = process.env.PORT;

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
    credentials: true,
  }),
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

////// Routes///////////////////

app.use("/api/auth", UserRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});
