import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  picture: {
    type: String,
  },
  contact: {
    type: String,
    required:true
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  address:{
    type: String,
    required: true,
  },
  role: {
    type:String,
    required:true
  },
  designation: {
    type:String,
    required:true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  jobType: {
    type:String,
    required:true
  },
  status: {
    type: Boolean,
    default: false,
  },
  compnayId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "company",
  },
  
});

export const User = mongoose.model("user", UserSchema);
