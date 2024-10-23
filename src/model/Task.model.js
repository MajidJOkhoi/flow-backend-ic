import mongoose from "mongoose";

const taskSchema=mongoose.Schema({
    taskTitle:{type:String,required:true,unique:true},
    description:{type:String,required:true},
    dueDate:{type:String,required:true},
    status:{type:String,default:"ongoing"},
    assignMember:{type:[mongoose.Schema.Types.ObjectId],ref:"User",required:true},
    projectId:{type:[mongoose.Schema.Types.ObjectId],ref:"Project",required:true},
    createdAt:{type:String,default:new Date().toDateString()},
    updatedAt:{type:String,default:new Date().toDateString()}
})

export const Task=mongoose.model("Task",taskSchema)
