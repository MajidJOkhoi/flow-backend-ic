import { Router } from "express";
import { create, createAdmin, deleteUser, getMyAllUsers, getTeamHeadDetails, getUserById, login, logout, myProfile, updatePicture, updateUserRecord } from "../controller/user.controller.js";
import {upload} from "../middleware/multer.js"
import {auth} from "../middleware/auth.js"
import { admin } from "../middleware/admin.js";
 const userRoute=Router()


 userRoute.route("/create").post(auth,create)
 userRoute.route("/createAdmin").post(createAdmin)
 userRoute.route("/login").post(login)
 userRoute.route("/logout").post(auth,logout)
 userRoute.route("/delete/:userId").put(admin,deleteUser)
 userRoute.route("/updatePicture").put(auth,upload.single("profileImage"),updatePicture)
 userRoute.route("/myProfile").get(auth,myProfile)
 userRoute.route("/updateUserRecord/:id").put(updateUserRecord)
 userRoute.route("/getMyAllUsers").get(auth,getMyAllUsers)
 userRoute.route("/getAllTeamHeads").get(getTeamHeadDetails)
 userRoute.route("/getUserById/:_id").get(getUserById)


export default userRoute