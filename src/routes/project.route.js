import { Router } from "express";
import { create, getAssginMembersByProjectId, getMyProjects } from "../controller/project.controller.js";
import { auth } from "../middleware/auth.js";

 const projectRouter=Router()

 projectRouter.route("/create").post(auth,create)
 projectRouter.route("/getMyProjects").get(auth,getMyProjects)
projectRouter.route("/getProjectMembers/:_id").get(getAssginMembersByProjectId)




export  {projectRouter}