
import { Router } from "express";
import { checkIn, checkOut } from "../controller/attendance.controller.js";
import { auth } from "../middleware/auth.js";



 const attendanceRoute=Router()


 attendanceRoute.route("/checkIn").post(auth,checkIn)
 attendanceRoute.route("/checkOut").post(auth,checkOut)



export { attendanceRoute}