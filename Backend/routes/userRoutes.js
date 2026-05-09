import express from "express";
import { CreateUser, LoginUser } from "../controllers/authController.js";
import { VerifyToken, VerifyUser } from "../middleware/authMiddleware.js";

const UserRouter = express.Router();

UserRouter.post("/register", CreateUser);
UserRouter.post("/login", LoginUser);

export default UserRouter;
