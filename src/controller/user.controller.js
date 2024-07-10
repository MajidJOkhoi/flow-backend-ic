import { User } from "../model/user.model.js";
import { ApiError } from "../utlis/ApiError.js";
import jwt from "jsonwebtoken"
const create = async (req, res) => {
    const { username, email, password } = req.body;
    
    if([username,email,password].some(item=> item?.trim()=="")){
        throw new ApiError(401,"All Feilds are Require")
    }

    const exits=await User.findOne({email})

    if(exits){
    throw new ApiError(400,"This User Already Exits") 
    }

    const user = await User.create({ username, email, password });

    if(!user){
      throw new ApiError(401,"Error Occur While Creating a User")
    }


    res.status(200).json({
      user: user,
      message:"Sucessfully Craeted",
      success: true,
    });
  
  };
  
  
  const login = async (req, res) => {
      const {  email, password } = req.body;
           
      if([email,password].some(item=>item.trim()=="")){
        throw new ApiError(401,"All fields are require")
    }
         

      const user = await User.findOne({  email });
    
        
      const checkPassword=password==user.password

   if(!checkPassword){
    throw new ApiError(401,"Password is incorrect......")
   
   }
   const token=jwt.sign({_id:user._id},process.env.JWT_SECRET)


   
    res.status(200).cookie("token",token,{httpOnly:true,secure:true}).json({
      message:"Sucessfully login",
      success: true,
    });
   
  
     

    }

    export {create,login}