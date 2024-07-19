import { Router } from "express";
import { createDesignation, getAllDesignation } from "../controller/designation.controller.js";

 const designationRoute=Router()

 designationRoute.route("/create").post(createDesignation)
 designationRoute.route("/getAllJobTypes").get(getAllDesignation)




export  {designationRoute}