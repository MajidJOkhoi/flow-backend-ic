import { Router } from "express";
import { create, login } from "../controller/user.controller.js";


 const userRoute=Router()


 userRoute.route("/create").post(create)
 userRoute.route("/login").post(login)


export default userRoute