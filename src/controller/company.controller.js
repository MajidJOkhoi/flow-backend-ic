import { Company } from "../model/company.model.js"
import { Designation } from "../model/designation.model.js"
import { JobType } from "../model/jobType.model.js"
import { Role } from "../model/role.model.js"
import { User } from "../model/user.model.js"
import {LicenceKey} from "../model/LicenceKey.model.js"
import { ApiError } from "../utlis/ApiError.js"



const companyRegistration=async(req,res)=>{

const {name,companyOwner,address,email,contact,licenceKey}=req.body


const registration=await Company.create({name,companyOwner,address,email,contact,licenceKey})

if(!registration){
    throw new ApiError(400,"Error occur while registration of company")
}


res.status(200).json({
        sucess:true,
        message:"Sucessfully company registered",
        data:{_id:registration._id}
    })
}


export {companyRegistration}