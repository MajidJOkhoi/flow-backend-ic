import mongoose from "mongoose";

const commentSchema=mongoose.Schema({
    content:{
        type:String,
        required:true,
    },
    commentBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    createdAt:{
        type:String,
        default:new Date().toDateString(),
    }
})

export const Comment=mongoose.model("Comment",commentSchema)