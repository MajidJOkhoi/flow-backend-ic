import mongoose from "mongoose"
import bcrypt from "bcrypt"
const UserSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },role:{
        type:String,
        default:"user"
    }
})

UserSchema.pre("save", async function (next){
        if(!this.isModified("password")) return null
      this.password=await bcrypt.hash(this.password,10)
      next()
    })

UserSchema.methods.issPasswordCorrect= async function (password){
    return await bcrypt.compare(password,this.password)
}
    

export const User =mongoose.model("user",UserSchema)
