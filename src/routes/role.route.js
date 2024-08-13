import { Router } from "express";
import { createRole, getAllRoles } from "../controller/role.controller.js";
import { auth } from "../middleware/auth.js";
 const roleRoute=Router()

 roleRoute.route("/create").post(createRole)
 roleRoute.route("/getAllRoles").get(auth,getAllRoles)




export  {roleRoute}