import { LicenceKey } from "../model/LicenceKey.model.js";
import { User } from "../model/user.model.js";
import { ApiError } from "../utlis/ApiError.js";
import { cloudinaryUpload } from "../utlis/cloudinary.js";

import jwt from "jsonwebtoken";

const create = async (req, res, next) => {
  const admin = req.user._id;

  if (!admin) {
   return next(new ApiError(400, "Login first"));
  }
  const {
    fullName,
    email,
    password,
    address,
    contact,
    jobType,
    role,
    designation,
    companyId,
  } = req.body;

  if (
    [
      fullName,
      email,
      password,
      contact,
      address,
      jobType,
      role,
      designation,
      companyId,
    ].some((item) => item?.trim() == "")
  ) {
    return next(new ApiError(400, "All Feilds are Require"));
  }

  const exits = await User.findOne({ email });

  if (exits) {
    return  next(new ApiError(400, "This User Already Exits"));
  }

  const user = await User.create({
    fullName,
    email,
    password,
    contact,
    address,
    jobType,
    role,
    designation,
    companyId,
    createdBy: admin,
  });

  if (!user) {
    return  next(new ApiError(401, "Error Occur While Creating a User"));
  }

  res.status(200).json({
    message: "Sucessfully user created",
    success: true,
    user: user,
  });
};

const login = async (req, res, next) => {
 try {
  const { email, password } = req.body;

  if ([email, password].some((item) => item.trim() == "")) {
    return next(new ApiError(401, "All fields are require"));
  }

  const user = await User.findOne({ email });
  if (!user) {
    return next(new ApiError(400, "Incorrect Email"));
  }
  

  const checkPassword = password == user?.password;

  if (!checkPassword) {
    return next(new ApiError(401, "Password is incorrect......"));
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
 } catch (error) {
  next(error)
 }
};

const updatePicture = async (req, res) => {
  const _id = req.user._id;
  const imagePath = req.file?.path;
  if (!_id) {
    return next(ApiError(400, "unauthorized action , Login First"))
  }
  if (!imagePath) {
    return next(ApiError(401, "Please provide the image path"))
  }
  const cloudPathImage = await cloudinaryUpload(imagePath);
  if (!cloudPathImage) {
    return next(ApiError(401, "Try again image does not upload "))
  }

  const user = await User.findOne({ _id });
  if (!user) {
    return next( ApiError(400, "user does not exits  "))
  }

  user.profilePicture = cloudPathImage?.url || user.profilePicture;

  await user.save();

  res.status(200).json({
    message: "Sucessfully image uploaded ",
    success: true,
  });
};

const myProfile = async (req, res,next) => {
  const _id = req?.user._id;
  if (!_id) {
    return new ApiError(400, "unauthorized action , Login First");
  }

  const user = await User.aggregate([
    {
      $match: { _id },
    },
    {
      $lookup: {
        from: "roles",
        localField: "role",
        foreignField: "id",
        as: "role",
      },
    },
    {
      $lookup: {
        from: "designations",
        localField: "designation",
        foreignField: "id",
        as: "designation",
      },
    },
    {
      $lookup: {
        from: "jobtypes",
        localField: "jobType",
        foreignField: "id",
        as: "jobType",
      },
    },
    {
      $project: {
        _id: 1,
        fullName: 1,
        contact: 1,
        email: 1,
        address: 1,
        role: 1,
        designation: 1,
        jobType: 1,
        status: 1,
      },
    },
  ]);

  if (!user) {
    return next(ApiError(400, "user does not exits  "))
  }

  res.status(200).json({
    user,
    message: "Sucessfully get current the user record ",
    success: true,
  });
};

const updateUserRecord = async (req, res,next) => {
  const { birthDate, designation, skill, branchName, phoneNo, address } =
    req.body;
  const _id = req?.user._id;

  if (!_id) {
    return next(ApiError(400, "unauthorized action , Login First"))
  }

  const user = await User.findOne({ _id });
  if (!user) {
    return next(ApiError(400, "user does not exits  "))
  }

  user.birthDate = birthDate;
  user.designation = designation;
  user.skill = skill;
  user.branchName = branchName;
  user.phoneNo = phoneNo;
  user.address = address;

  await user.save();

  const updatedUser = await User.findOne({ _id: user._id });
  res.status(200).json({
    user: updatedUser,
    message: "Sucessfully User Record Updated.... ",
    success: true,
  });
};

const logout = async (req, res) => {
  if (req && req.user) {
    res.status(201).clearCookie("token", "").json({
      success: true,
      message: "Sucessfully Logout",
    });
  }
};

const createAdmin = async (req, res,next) => {
  const { fullName, contact, email, address, password, companyId, licenceKey } =
    req.body;

  if (
    [fullName, contact, address, email, password, companyId, licenceKey].some(
      (item) => item.trim() === ""
    )
  ) {
    return next(ApiError(400, "All Fields are require....")) 
  }

  const existsAdmin = await User.findOne({ email });

  if (existsAdmin) {
    return next(ApiError(400, "This email already exists"))
  }

  const admin = await User.create({
    fullName,
    contact,
    email,
    address,
    password,
    companyId,
    designation: "2",
    role: "1",
    jobType: "1",
  });

  if (!admin) {
    return next(ApiError(400, "Error occur while creating admin"))
  }

  const licencekey = await LicenceKey.findOne({ _id: licenceKey });

  licencekey.status = true;

  await licencekey.save();

  res.status(200).json({
    sucess: true,
    message: "Sucessfully created admin",
    admin,
  });
};

const getMyAllUsers = async (req, res,next) => {
  const myUsers = await User.find({ companyId: req.user.companyId });
  if (!myUsers) {
    return next( ApiError(400, "error occur while getting all users your company"))
  }

  res.status(200).json({
    message: "Sucessfully get all users of your Company ",
    success: true,
    myUsers,
  });
};

const deleteUser = async (req, res,next) => {
  const { userId } = req.params;

  if (!userId) {
    return next(ApiError(400, "User id is required"))
  }

  const user = await User.findOne({ _id: userId });

  if (!user) {
    return next(ApiError(400, "This user does not exists"))
  }

  const delUser = await User.updateOne(
    { _id: userId },
    { $set: { status: true } }
  );

  if (!delUser) {
    return next(ApiError(400, "Error occur while deleting this user"))
  }

  res.status(200).json({
    success: true,
    message: "Successfully user deleted",
    user: req.user,
  });
};

const getTeamHeadDetails=async(req,res,next)=>{
  const teamHeads = await User.aggregate([
    {
      $match:{role:"2"},
    },
   
    {
      $project: {
        _id: 1,
        fullName: 1,  
        email: 1, 
        status: 1,
      },
    },
  ]);

  res.status(200).json({
    success:true,message:"successfully get all teamHeads names",teamHeads
  })
}
export {
  create,
  login,
  updatePicture,
  myProfile,
  updateUserRecord,
  logout,
  createAdmin,
  getMyAllUsers,
  deleteUser,
  getTeamHeadDetails
};
