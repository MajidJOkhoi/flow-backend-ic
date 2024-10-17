
import { Router } from "express";
import { checkIn, checkOut, getMyMonthAttendance, getMyAllAttendance, getTodayAttendance, getAllUserAttendance, getMyMonthAttendanceById, countTodayAttendies, getMyTeamMemberTodayAttendanceRecord, myWorkingHours, getTodayAbsentUsers, getTodayPresentUsers, deleteAttendance, updateAttendance, makeAttendanceFromWeb, getMyTeamMemberMonthlyRecord } from "../controller/attendance.controller.js";
import { auth } from "../middleware/auth.js";
import {admin} from "../middleware/admin.js"



 const attendanceRoute=Router()


attendanceRoute.route("/checkIn").post(auth,checkIn)
attendanceRoute.route("/checkOut").post(auth,checkOut)
attendanceRoute.route("/getTodayAttendance/:date").get(auth,getTodayAttendance)
attendanceRoute.route("/getMyAllAttendances").get(auth,getMyAllAttendance)
attendanceRoute.route("/getMyMonthAttendance/:month").get(auth,getMyMonthAttendance)
attendanceRoute.route("/getUsersAttendance").get(admin,getAllUserAttendance)
attendanceRoute.route("/getMyMonthAttendanceById").get(getMyMonthAttendanceById)
attendanceRoute.route("/getTodayAttendiesCount").get(admin,countTodayAttendies)
attendanceRoute.route("/getMyTeamMemberAttendanceStatus").get(auth,getMyTeamMemberTodayAttendanceRecord)
attendanceRoute.route("/myWorkingHours/:month").get(auth,myWorkingHours)
attendanceRoute.route("/getAllTodayAbsentUsers").get(auth,getTodayAbsentUsers)
attendanceRoute.route("/getAllTodayPresentUsers").get(auth,getTodayPresentUsers)
attendanceRoute.route("/delete/:id").delete(deleteAttendance)
attendanceRoute.route("/update/:attendanceId").post(updateAttendance)
attendanceRoute.route("/markAttendance/:userid").post(makeAttendanceFromWeb)
attendanceRoute.route("/getTeamMembersMonthlyRecord/:month").get(auth,getMyTeamMemberMonthlyRecord)
export { attendanceRoute}