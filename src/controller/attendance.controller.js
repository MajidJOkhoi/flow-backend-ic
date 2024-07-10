import { ApiError } from "../utlis/ApiError.js"
import { Attendance } from "../model/attendance.model.js"

const checkIn=async(req,res)=>{
const {checkIn} =req.body

if(!checkIn){
    throw new ApiError(402,"could not detect the location....")
   }
   const  attendance=await Attendance.create({checkIn,checkOut:{},user:req.user._id})

   if(!attendance){
    throw new ApiError(400,"Error occur while checkIn  ")
   }

res.status(200).json({
    sucess:true,
    message:"Sucessfully You CheckIn....."
})
}


const checkOut=async(req,res)=>{
    const {checkOut} =req.body
   

    if(!checkOut){
        throw new ApiError(402,"could not detect the location....")
       }
       const  checkout=await Attendance.updateOne({user:req.user._id},{$set:{checkOut:checkOut}})
    
       if(!checkout){
        throw new ApiError(400,"Error occur while checkOut  ")
       }



    res.json({
       sucess:true,
    message:"Sucessfully You CheckOut....."
    })
    }


export {checkIn,checkOut}