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
    image:{
        type:String,
    },
    applydate:{
        type:String,
        required:true
        },
    status:{
        type:Boolean,
        required:true,
        default:false
    },
    leaveType:{
        type:String
    }

})

export const Leave=mongoose.model("leave",leaveSchema)