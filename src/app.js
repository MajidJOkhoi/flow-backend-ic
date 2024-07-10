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

import { attendacneRoute } from "./routes/attendance.route.js"
app.use("/api/attendance",attendacneRoute)
app.get("/",(req,res)=>{
    res.json({
        success:true
    })
})

export {app}