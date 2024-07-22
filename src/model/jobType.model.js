import mongoose from "mongoose";


const jobTypeSchema=new mongoose.Schema({
    id:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    }
})


export const JobType=mongoose.model("jobType",jobTypeSchema)
