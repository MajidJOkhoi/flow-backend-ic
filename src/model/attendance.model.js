import mongoose from "mongoose";


const attendanceSchma=new mongoose.Schema({
     checkIn:{
        type:Object,
        required:true
     },
     checkOut:{
        type:Object,
        required:true
     },
     user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
     }
     
})


export const Attendance=mongoose.model("attendance",attendanceSchma)