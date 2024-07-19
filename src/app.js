import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
const app=express()

app.use(cors({origin:process.env.ORIGIN,credentials:true}))
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


app.get("/",(req,res)=>{
    res.json({
        success:true
    })
})



export {app}