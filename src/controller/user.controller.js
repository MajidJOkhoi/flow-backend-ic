import { User } from "../model/user.model.js";

const create = async (req, res) => {
    const { username, email, password } = req.body;
    
    if([username,email,password].some(item=> item?.trim()=="")){
        throw new Error("All Feilds are Require")
    }

    const exits=await User.findOne({email})

    if(exits){
      res.json({
        success: false,
        message:"This User Already Exits",
       
      });
     
    }

    const user = await User.create({ username, email, password });

    if(!user){
       res.json({
        success: false,
        message:"Databse Error ......",
       
      });
    }
    res.json({
      user: user,
      message:"Sucessfully Craeted",
      success: true,
    });
  };
  
  
  const login = async (req, res) => {
      const {  email, password } = req.body;
           
      if([email,password].some(item=>item.trim()=="")){
        throw new Error("Email & Password are required")
    }
         

      const user = await User.findOne({  email });
    
        
      const checkPassword=password==user.password
   if(!checkPassword){
    res.status(401).json({
      success: false,
      message:"Passwrod Incorrect",
    });
   }
  
      res.status(200).json({
        message:"Sucessfully login",
        success: true,
      });
    }

    export {create,login}