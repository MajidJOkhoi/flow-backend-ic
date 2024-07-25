import { Router } from "express";
import { createJobType, getAllJobTypes } from "../controller/jobType.controller.js";
 const jobTypeRoute=Router()

 jobTypeRoute.route("/create").post(createJobType)
 jobTypeRoute.route("/getALlJobTypes").get(getAllJobTypes)




export  {jobTypeRoute}