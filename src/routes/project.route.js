import { Router } from "express";
import { create } from "../controller/project.controller.js";
import { auth } from "../middleware/auth.js";

 const projectRouter=Router()

 projectRouter.route("/create").post(auth,create)





export  {projectRouter}