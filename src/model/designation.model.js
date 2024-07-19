import mongoose from "mongoose";


const designationSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    }
})


export const Designation=mongoose.model("designation",designationSchema)
