import { LicenceKey } from "../model/LicenceKey.model.js"
import { licenceKeyRoute } from "../routes/licenceKey.route.js"
import { ApiError } from "../utlis/ApiError.js"

const createLicenceKey=async(req,res,next)=>{
 const {key} =req.body
 if(!key){
    return next(new ApiError(400,"Key is required")) 
 }

 const Licencekey=await LicenceKey.create({key})

 if(!Licencekey){
    return next(new ApiError(400,"Error occur while creating licence key")) 
 }

    res.status(200).json({
        sucess:true,
        message:"Sucessfully Created Licence Key",
        Licencekey
    })
}

const authKey=async(req,res,next)=>{

   const {key} =req.body
   if(!key){
      return next(new ApiError(400,"Key is required")) 
   }
  
   const Licencekey=await LicenceKey.findOne({key}).select("-createdAt -updatedAt")
  
   if(!Licencekey){
      return next(new ApiError(400,"Invalid Key")) 
   }

   if(Licencekey.status===true){
      return next(new ApiError(400,"this key is already in use")) 
   }
  
      res.status(200).json({
          sucess:true,
          message:"Sucessfully get Key",
          Licencekey
      })


}


export {createLicenceKey,authKey}