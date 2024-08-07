import mongoose from "mongoose";

const leaveSchema=new mongoose.Schema({
    description:{
        type:String,
        required:true
    },
    teamHead:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    intialDate:{
        type:String,
        required:true
    },
    endDate:{
        type:String,
        required:true
    },
    totalDays:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        required:true,
        default:false
    }

})

export const Leave=mongoose.model("leave",leaveSchema)