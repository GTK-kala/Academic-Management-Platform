import express from "express";
import { CreateUser, LoginUser } from "../controllers/authController.js";
import { VerifyToken, VerifyUser } from "../middleware/authMiddleware.js";
import { Get_User } from "../controllers/userController.js";

const UserRouter = express.Router();

UserRouter.get("/profile/:userId", Get_User);
UserRouter.post("/login", LoginUser);
UserRouter.post("/register", CreateUser);

export default UserRouter;
