import { Router } from "express";
import { create, createAdmin, getMyAllUsers, login, logout, myProfile, updatePicture, updateUserRecord } from "../controller/user.controller.js";
import {upload} from "../middleware/multer.js"
import {auth} from "../middleware/auth.js"
 const userRoute=Router()


 userRoute.route("/create").post(auth,create)
 userRoute.route("/createAdmin").post(createAdmin)
 userRoute.route("/login").post(login)
 userRoute.route("/logout").post(auth,logout)
 userRoute.route("/updatePicture").put(auth,upload.single("profileImage"),updatePicture)
 userRoute.route("/myProfile").get(auth,myProfile)
 userRoute.route("/updateUserRecord").put(auth,updateUserRecord)
 userRoute.route("/getMyAllUsers").get(auth,getMyAllUsers)


export default userRoute