import { User } from "../model/user.model.js";

const create = async (req, res) => {
    const { username, email, password } = req.body;
    
    if([username,email,password].some(item=> item?.trim()=="")){
        throw new Error("All Feilds are Require")
    }

    const user = await User.create({ username, email, password });

    if(!user){
        throw new Error("user does not created")
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
      if (!user){
        throw new Error("This user Already Exists.......")
      }
        
      
         const isCorrect=await user.issPasswordCorrect(password) 
  
         if (!isCorrect) {
            throw new Error("Password is Incorrect")
         }
  
  
      res.status(200).json({
        message:"Sucessfully login",
        success: true,
      });
    }

    export {create,login}