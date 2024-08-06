import mongoose from "mongoose";

const projectSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true,
    },
    companyName:{
         type:mongoose.Schema.Types.ObjectId,
        ref:"company",
        required:true,
    },
    createdAt:{
        type:String,
        required:true,
        default:new Date().toDateString()
    }
})


export const Project =mongoose.model("project",projectSchema)