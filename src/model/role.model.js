import mongoose from "mongoose";


const roleSchema=new mongoose.Schema({
    id:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    }
})


export const Role=mongoose.model("role",roleSchema)
