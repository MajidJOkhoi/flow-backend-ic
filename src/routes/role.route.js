import { Router } from "express";
import { createRole, getAllRoles } from "../controller/role.controller.js";

 const roleRoute=Router()

 roleRoute.route("/create").post(createRole)
 roleRoute.route("/getAllRoles").get(getAllRoles)




export  {roleRoute}