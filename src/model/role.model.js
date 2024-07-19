import mongoose from "mongoose";


const roleSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    }
})


export const Role=mongoose.model("role",roleSchema)
