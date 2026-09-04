import express from "express";
import { CreateUser, LoginUser } from "../controllers/authController.js";
import { VerifyToken, VerifyUser } from "../middleware/authMiddleware.js";
import { Get_User, Update_User } from "../controllers/userController.js";

const UserRouter = express.Router();

UserRouter.get("/profile/:userId", VerifyToken, Get_User);
UserRouter.put("/profile/:userId", VerifyToken, Update_User);
UserRouter.post("/login", LoginUser);
UserRouter.post("/register", CreateUser);

export default UserRouter;
