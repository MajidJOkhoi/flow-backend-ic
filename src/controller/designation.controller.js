
import { Designation } from "../model/designation.model.js"
import { ApiError } from "../utlis/ApiError.js"


const createDesignation=async(req,res)=>{
 const {name} =req.body
 if(!name){
    throw new ApiError(400,"designation name is required")
 }

 const designation=await Designation.create({name})

 if(!designation){
    throw new ApiError(400,"Error occur while designation")
 }

    res.status(200).json({
        sucess:true,
        message:"Sucessfully create designation",
        designation
    })
}

const getAllDesignation=async(req,res)=>{
  
   const designations=await Designation.find()
  
   if(!designations){
      throw new ApiError(400,"No any designation find")
   }
  
      res.status(200).json({
          sucess:true,
          message:"Sucessfully get all designations",
          designations
      })


}


export {createDesignation,getAllDesignation}