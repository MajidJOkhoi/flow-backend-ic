import mongoose from "mongoose";


const jobTypeSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    }
})


export const JobType=mongoose.model("jobType",jobTypeSchema)
