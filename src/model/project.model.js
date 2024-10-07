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
    dueData:{
        type:String,
        required:true
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true,
    },
    createdAt:{
        type:String,   
        default:new Date().toDateString()
    },
    updatedAt:{
        type:String,
        default:new Date().toDateString()
    },
    status:{
        type:String,
        required:true,
    },assignMember:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"User"
    },
    attachments:{
        type:[String]
    },
    priority:{
        type:String,
        required:true
    }
})


export const Project =mongoose.model("project",projectSchema)