import { LicenceKey } from "../model/LicenceKey.model.js"
import { licenceKeyRoute } from "../routes/licenceKey.route.js"
import { ApiError } from "../utlis/ApiError.js"

const createLicenceKey=async(req,res)=>{
 const {key} =req.body
 if(!key){
    throw new ApiError(400,"Key is required")
 }

 const Licencekey=await LicenceKey.create({key})

 if(!Licencekey){
    throw new ApiError(400,"Error occur while creating licence key")
 }

    res.status(200).json({
        sucess:true,
        message:"Sucessfully Created Licence Key",
        Licencekey
    })
}

const authKey=async(req,res)=>{

   const {key} =req.body
   if(!key){
      throw new ApiError(400,"Key is required")
   }
  
   const Licencekey=await LicenceKey.findOne({key}).select("-createdAt -updatedAt")
  
   if(!Licencekey){
      throw new ApiError(400,"Invalid Key")
   }

   if(Licencekey.status===true){
      throw new ApiError(400,"this key is already in use")
   }
  
      res.status(200).json({
          sucess:true,
          message:"Sucessfully get Key",
          Licencekey
      })


}


export {createLicenceKey,authKey}