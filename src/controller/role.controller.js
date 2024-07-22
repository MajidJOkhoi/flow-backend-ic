import { Role } from "../model/role.model.js"
import { ApiError } from "../utlis/ApiError.js"


const createRole=async(req,res)=>{
   const {name,id} =req.body
   if(!name){
      throw new ApiError(400,"role  name is required")
   }
  
   if(!id){
     throw new ApiError(400,"role id is required")
  }

 const role=await Role.create({id,name})

 if(!role){
    throw new ApiError(400,"Error occur while creating role")
 }

    res.status(200).json({
        sucess:true,
        message:"Sucessfully create role",
        data:{name:role.name,id:role.id}
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