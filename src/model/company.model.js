import mongoose from "mongoose";


const companySchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    companyOwner:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    contact:{
        type:String,
        required:true
    },
    registrationDate:{
        type:Date,
        default:new Date().toDateString()
    },
    status:{
        type:Boolean,
        default:false

    },
    licenceKey:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"licenceKey",
        required:true
    }
}
)


export const Company=mongoose.model("company",companySchema)
