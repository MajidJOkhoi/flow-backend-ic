import { Role } from "../model/role.model.js"
import { ApiError } from "../utlis/ApiError.js"


const createRole=async(req,res)=>{
 const {name} =req.body
 if(!name){
    throw new ApiError(400,"role name is required")
 }

 const role=await Role.create({name})

 if(!role){
    throw new ApiError(400,"Error occur while creating role")
 }

    res.status(200).json({
        sucess:true,
        message:"Sucessfully create role",
        role
    })
}

const getAllRoles=async(req,res)=>{
  
   const roles=await Role.find()
  
   if(!roles){
      throw new ApiError(400,"No any role find")
   }
  
      res.status(200).json({
          sucess:true,
          message:"Sucessfully get all roles",
          roles
      })


}


export {createRole,getAllRoles}