import express from "express";
import { CreateUser, LoginUser } from "../controllers/authController.js";
import { VerifyToken } from "../middleware/authMiddleware.js";
import {
  Get_User,
  Update_User,
  Update_Password,
} from "../controllers/userController.js";

const UserRouter = express.Router();

UserRouter.get("/profile/:userId", Get_User);
UserRouter.put("/profile/:userId", Update_User);
UserRouter.put("/password/:userId", Update_Password);
UserRouter.post("/login", LoginUser);
UserRouter.post("/register", CreateUser);

export default UserRouter;
