import mongoose from "mongoose";


const attendanceSchma=new mongoose.Schema({
     checkIn:{
        type:Object,
        required:true
     },
     checkOut:{
        type:Object
     },
     user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
     },
     date:{
      type:String,
      required:true
     },
     status:{
      type:String
     },
     duration:{
      type:Object
     }

     
})


export const Attendance=mongoose.model("attendance",attendanceSchma)