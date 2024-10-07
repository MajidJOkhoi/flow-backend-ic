import { Router } from "express";
import { applyLeave, getAllLeaves, getMyLeaves } from "../controller/leave.controller.js";
import { auth } from "../middleware/auth.js";
import { upload } from "../middleware/multer.js";
 const leaveRouter=Router()

 leaveRouter.route("/apply").post(upload.single("image"),auth,applyLeave)
 leaveRouter.route("/getAllLeaves").get(getAllLeaves)
 leaveRouter.route("/getMyLeaves").get(auth,getMyLeaves)
export  {leaveRouter}