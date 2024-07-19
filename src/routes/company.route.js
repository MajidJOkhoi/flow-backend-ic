import { Router } from "express";
import { companyRegistration } from "../controller/company.controller.js";
 const companyRoute=Router()

 companyRoute.route("/registration").post(companyRegistration)




export  {companyRoute}