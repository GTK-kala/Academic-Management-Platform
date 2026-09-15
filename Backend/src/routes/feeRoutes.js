import express from "express";
import { VerifyToken, VerifyUser } from "../middleware/authMiddleware.js";
import {
  Add_Fee_Structure,
  Pay_Fee_Structure,
  Get_Fee_Structure,
  Get_Fee_Structures,
  Payed_Fee_Structure,
} from "../controllers/feeController.js";

const FeeRouter = express.Router();

FeeRouter.get("/structure", VerifyToken, Get_Fee_Structures);
FeeRouter.get("/structure/:id", VerifyToken, Get_Fee_Structure);
FeeRouter.post("/structure/add", VerifyToken, Add_Fee_Structure);
FeeRouter.put("/structure/pay", VerifyToken, Pay_Fee_Structure);
FeeRouter.get("/structure/payed/:userId", VerifyToken, Payed_Fee_Structure);

export default FeeRouter;
