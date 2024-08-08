
import { Router } from "express";
import { checkIn, checkOut, getMyMonthAttendance, getMyAllAttendance, getTodayAttendance, getAllUserAttendance, getMyMonthAttendanceById } from "../controller/attendance.controller.js";
import { auth } from "../middleware/auth.js";




 const attendanceRoute=Router()


 attendanceRoute.route("/checkIn").post(auth,checkIn)
 attendanceRoute.route("/checkOut").post(auth,checkOut)
attendanceRoute.route("/getTodayAttendance").get(auth,getTodayAttendance)
attendanceRoute.route("/getMyAllAttendances").get(auth,getMyAllAttendance)
attendanceRoute.route("/getMyMonthAttendance/:month").get(auth,getMyMonthAttendance)
attendanceRoute.route("/getUsersAttendance").get(getAllUserAttendance)
attendanceRoute.route("/getMyMonthAttendanceById").get(getMyMonthAttendanceById)



export { attendanceRoute}