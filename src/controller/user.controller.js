import { LicenceKey } from "../model/LicenceKey.model.js";
import { User } from "../model/user.model.js";
import { ApiError } from "../utlis/ApiError.js";
import { cloudinaryUpload } from "../utlis/cloudinary.js";

import jwt from "jsonwebtoken";


const create = async (req, res) => {
   
  const admin=req.user._id

  if(!admin){
     throw new ApiError(400,"Login first")
  }
  const { fullName, email,password, address,contact,jobType,role,designation,companyId } = req.body;
   
  if ([fullName, email, password,contact,address,jobType,role,designation,companyId].some((item) => item?.trim() == "")) {
    throw new ApiError(400, "All Feilds are Require");
  }

  


  const exits = await User.findOne({ email });

  if (exits) {
    throw new ApiError(400, "This User Already Exits");
  }

  const user = await User.create({ fullName, email, password ,contact,address,jobType,role,designation,companyId,createdBy:admin});

  if (!user) {
    throw new ApiError(401, "Error Occur While Creating a User");
  }

  res.status(200).json({
    message: "Sucessfully user created",
    success: true,
    user: user,
  });

};

const login = async (req, res) => {
  const { email, password } = req.body;

  if ([email, password].some((item) => item.trim() == "")) {
    throw new ApiError(401, "All fields are require");
  }

  const user = await User.findOne({ email });

  const checkPassword = password == user.password;

  if (!checkPassword) {
    throw new ApiError(401, "Password is incorrect......");
  }
  const user_ = await User.findOne({ email }).select("-password");
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

  res
    .status(200)
    .cookie("token", token, { httpOnly: true, secure: true })
    .json({
      user_,
      token,
      message: "Sucessfully login",
      success: true,
    });
};

const updatePicture = async (req, res) => {
  const _id = req.user._id;
  const imagePath = req.file?.path;
  if (!_id) {
    throw new ApiError(400, "unauthorized action , Login First");
  }
  if (!imagePath) {
    throw new ApiError(401, "Please provide the image path");
  }
  const cloudPathImage = await cloudinaryUpload(imagePath);
  if (!cloudPathImage) {
    throw new ApiError(401, "Try again image does not upload ");
  }

  const user = await User.findOne({ _id });
  if (!user) {
    throw new ApiError(400, "user does not exits  ");
  }

  user.profilePicture = cloudPathImage?.url || user.profilePicture;

  await user.save();

  res.status(200).json({
    message: "Sucessfully image uploaded ",
    success: true,
  });
};

const myProfile = async (req, res) => {
  const _id = req?.user._id;
  if (!_id) {
    throw new ApiError(400, "unauthorized action , Login First");
  }

  const user = await User.findOne({ _id }).select("-password");
  if (!user) {
    throw new ApiError(400, "user does not exits  ");
  }

  res.status(200).json({
    user,
    message: "Sucessfully get current the user record ",
    success: true,
  });
};

const updateUserRecord = async (req, res) => {
  const { birthDate, designation, skill, branchName, phoneNo, address } =
    req.body;
  const _id = req?.user._id;

  if (!_id) {
    throw new ApiError(400, "unauthorized action , Login First");
  }

  const user = await User.findOne({ _id });
  if (!user) {
    throw new ApiError(400, "user does not exits  ");
  }

  user.birthDate = birthDate;
  user.designation = designation;
  user.skill = skill;
  user.branchName = branchName;
  user.phoneNo = phoneNo;
  user.address=address

  await user.save();

  const updatedUser = await User.findOne({ _id: user._id });
  res.status(200).json({
    user: updatedUser,
    message: "Sucessfully User Record Updated.... ",
    success: true,
  });
};


const logout=async(req,res)=>{
  if(req && req.user){
    res.status(201).clearCookie("token","").json({
      success:true,
      message:"Sucessfully Logout"
    })
  }
}


const createAdmin=async(req,res)=>{

const {fullName,contact,email,address,password,companyId,licenceKey}=req.body

if([fullName,contact,address,email,password,companyId,licenceKey].some(item=>item.trim()==="")){
  throw new ApiError(400,"All Fields are require....")
}

const existsAdmin=await User.findOne({email})

if(existsAdmin){
  throw new ApiError(400,"This email already exists")
}

const admin=await User.create({fullName,contact,email,address,password,companyId,designation:"2",role:"1",jobType:"1"})

  if(!admin){
    throw new ApiError(400,"Error occur while creating admin")
}

const licencekey=await LicenceKey.findOne({_id:licenceKey})

licencekey.status=true

await licencekey.save()

res.status(200).json({
  sucess:true,
  message:"Sucessfully created admin",
  admin
})

}

const getMyAllUsers=async(req,res)=>{
  
  const myUsers=await User.find({companyId:req.user.companyId})
  if(!myUsers){
   throw new ApiError(400,"error occur while getting all users your company")
  }


  res.status(200).json({
    message: "Sucessfully get all users of your Company ",
    success: true,
    myUsers
  });

}

export { create, login, updatePicture, myProfile, updateUserRecord,logout,createAdmin ,getMyAllUsers};
