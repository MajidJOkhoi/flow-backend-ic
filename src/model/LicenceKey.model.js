import mongoose from "mongoose";


const licenceKeySchema=new mongoose.Schema({
    key:{
        type:String,
        required:true
    },
    status:{
        type:Boolean,
        default:false

    }
},{
    timestamps:true
})


export const LicenceKey=mongoose.model("licenceKey",licenceKeySchema)
