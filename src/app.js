import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app=express()

const corsOptions = {
    origin: 'https://c-icreativez.web.app', // Use your exact frontend origin here
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'], // Include headers you're using
    credentials: true, // If you're sending cookies or credentials
  };
  
  // Enable CORS for all routes
  app.use(cors(corsOptions));
  
  // Respond to preflight requests
  app.options('*', cors(corsOptions));
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:"true",limit:"16kb"}))
app.use(cookieParser())



import userRoute from "./routes/user.route.js"
app.use("/api/user",userRoute)

import { attendanceRoute } from "./routes/attendance.route.js"
app.use("/api/attendance",attendanceRoute)

import { licenceKeyRoute } from "./routes/licenceKey.route.js"
app.use("/api/licenceKey",licenceKeyRoute)


import { companyRoute } from "./routes/company.route.js"
app.use("/api/company",companyRoute)


import { roleRoute } from "./routes/role.route.js"
app.use("/api/role",roleRoute)


import { designationRoute } from "./routes/designation.route.js"
app.use("/api/designation",designationRoute)


import { jobTypeRoute } from "./routes/jobType.route.js"
app.use("/api/jobType",jobTypeRoute)

import { projectRouter } from "./routes/project.route.js"
app.use("/api/project",projectRouter)

import { leaveRouter } from "./routes/leave.route.js"
app.use("/api/leave",leaveRouter)

import { commentRoute } from "./routes/comment.route.js"
app.use("/api/comment",commentRoute)
app.get("/",(req,res)=>{
    res.json({
        success:true
    })
})



export {app}