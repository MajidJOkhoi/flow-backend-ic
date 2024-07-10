
import { Router } from "express";
import { attendacne } from "../controller/attendance.controller.js";



 const attendacneRoute=Router()


 attendacneRoute.route("/attendance").post(attendacne)



export { attendacneRoute}