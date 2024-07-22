import { Company } from "../model/company.model.js"
import { Designation } from "../model/designation.model.js"
import { JobType } from "../model/jobType.model.js"
import { Role } from "../model/role.model.js"
import { User } from "../model/user.model.js"
import {LicenceKey} from "../model/LicenceKey.model.js"
import { ApiError } from "../utlis/ApiError.js"



const companyRegistration=async(req,res)=>{

const {company}=req.body



if(!company){
    throw new ApiError(400,"provide company details")
}



const registration=await Company.create({name:company.name,companyOwner:company.companyOwner,address:company.address,email:company.email,contact:company.contact,licenceKey:company.licenceKey})

if(!registration){
    throw new ApiError(400,"Error occur while registration of company")
}



const licencekey=await LicenceKey.findOne({_id:company.licenceKey})

if(!licencekey){
    throw new ApiError(400,"No record found with this key")
}

licencekey.status=true

await licencekey.save()



res.status(200).json({
        sucess:true,
        message:"Sucessfully company registered",
        registration,
      
    })
}


export {companyRegistration}