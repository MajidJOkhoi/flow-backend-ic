import { Router } from "express";
import { applyLeave, getAllLeaves } from "../controller/leave.controller.js";
import { auth } from "../middleware/auth.js";

 const leaveRouter=Router()

 leaveRouter.route("/apply").post(auth,applyLeave)
 leaveRouter.route("/getAllLeaves").get(getAllLeaves)
export  {leaveRouter}