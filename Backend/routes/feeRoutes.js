import express from "express";
import { VerifyToken } from "../middleware/authMiddleware.js";
import {
  Get_Fee_Structure,
  Add_Fee_Structure,
  Pay_Fee_Structure,
} from "../controllers/feeController.js";

const FeeRouter = express.Router();

FeeRouter.get("/structure", VerifyToken, Get_Fee_Structure);
FeeRouter.post("/structure/add", VerifyToken, Add_Fee_Structure);
FeeRouter.post("/structure/pay", VerifyToken, Pay_Fee_Structure);

export default FeeRouter;
