
import { JobType } from "../model/jobType.model.js"
import { ApiError } from "../utlis/ApiError.js"


const createJobType=async(req,res)=>{
   const {name,id} =req.body
   if(!name){
      throw new ApiError(400,"job  name is required")
   }
  
   if(!id){
     throw new ApiError(400,"job id is required")
  }

 const jobType=await JobType.create({id,name})

 if(!jobType){
    throw new ApiError(400,"Error occur while creating jobType")
 }

    res.status(200).json({
        sucess:true,
        message:"Sucessfully create jobType",
        data:{name:jobType.name,id:jobType.id}
    })
}

const getAllJobTypes=async(req,res)=>{
  
   const jobTypes=await JobType.find()
  
   if(!jobTypes){
      throw new ApiError(400,"No any jobType find")
   }
  
      res.status(200).json({
          sucess:true,
          message:"Sucessfully get all jobTypes",
          jobTypes
      })


}


export {createJobType,getAllJobTypes}