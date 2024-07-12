import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
  },
  birthDate: {
    type: String,
  },
  designation: {
    type: String,
  },
  skill: {
    type: Array,
  },
  branchName: {
    type: String,
  },
  phoneNo: {
    type: String,
  },
  address: {
    type: Object,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "user",
  },
});

export const User = mongoose.model("user", UserSchema);
