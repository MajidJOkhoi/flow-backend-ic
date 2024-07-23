import { Company } from "../model/company.model.js"
import { User } from "../model/user.model.js"
import {LicenceKey} from "../model/LicenceKey.model.js"
import { ApiError } from "../utlis/ApiError.js"



const companyRegistration=async(req,res)=>{

const {name,companyOwner,address,email,contact,lKey}=req.body

if([name,companyOwner,address,email,contact,lKey].some(item=>item.trim()==="")){
    throw new ApiError(400,"All Fields are require....")
}

const exitsCompany=await Company.findOne({$or:[{name},{email}]})

if(exitsCompany && exitsCompany?.email===email){
    throw new ApiError(400,"This company email already exits")
}

if(exitsCompany){
    throw new ApiError(400,"This compnay name already exists")
}

const useKey=await LicenceKey.findOne({_id:lKey})
  
   if (useKey && useKey?.status===true){
      throw new ApiError(400,"This key is Already in use")
   }


const registration=await Company.create({name,companyOwner,address,email,contact,licenceKey:lKey})

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