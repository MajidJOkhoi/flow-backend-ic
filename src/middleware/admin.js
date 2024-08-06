import jwt from "jsonwebtoken";
import { ApiError } from "../utlis/ApiError.js";
import { User } from "../model/user.model.js";
import mongoose from "mongoose";


const admin = async (req, res, next) => {
  const token =
    req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError("400", "unauthorized login......");
  }

  let { _id } = jwt.verify(token, process.env.JWT_SECRET);
 _id=new mongoose.Types.ObjectId(_id)
const user = await User.aggregate([
    {
      $match:{_id}
    },
    {
      $lookup:{
        from:"roles",
        localField:"role",
        foreignField:"id",
        as:"role"
      }
    },
    
    {
      $project:{
        "_id": 1,
            "fullName": 1,
            "contact": 1,
            "email": 1,
            "address": 1,
            "role":1, 
            "status":1 
      }
    }
  ])


  const role=JSON.stringify(user[0].role, null, 2)
  if(!role.name=="Admin"){
   throw new ApiError(400,"You are not authorized to perform this action")
  }


  req.user = user;
  next();
};

export { admin };
