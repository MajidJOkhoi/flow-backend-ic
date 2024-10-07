import mongoose from "mongoose";


const designationSchema=new mongoose.Schema({
    id:{
        type:String,
        required:true
    },
    
    name:{
        type:String,
        required:true
    }
   
})


export const Designation=mongoose.model("designation",designationSchema)
