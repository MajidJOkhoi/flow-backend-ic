import { Router } from "express";
import { create, getMyProjects } from "../controller/project.controller.js";
import { auth } from "../middleware/auth.js";

 const projectRouter=Router()

 projectRouter.route("/create").post(auth,create)
 projectRouter.route("/getMyProjects").get(auth,getMyProjects)





export  {projectRouter}