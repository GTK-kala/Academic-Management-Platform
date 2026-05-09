import express from "express";
import { CreateUser } from "../controllers/authController.js";

const UserRouter = express.Router();

UserRouter.post("/register", CreateUser);

export default UserRouter;
