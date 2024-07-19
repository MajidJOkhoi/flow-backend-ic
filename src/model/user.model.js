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
    type: mongoose.Schema.Types.ObjectId,
    ref: "role",
  },
  designation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "designation",
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  jobType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "jobType",
  },
  status: {
    type: Boolean,
    default: false,
  },
});

export const User = mongoose.model("user", UserSchema);
