import express from "express";
import { VerifyToken } from "../middleware/authMiddleware.js";
import { Get_Fee_Structure } from "../controllers/feeController.js";

const FeeRouter = express.Router();

FeeRouter.get("/structure", VerifyToken, Get_Fee_Structure);

export default FeeRouter;
