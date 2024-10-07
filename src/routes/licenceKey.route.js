import { Router } from "express";
import { authKey, createLicenceKey } from "../controller/licenceKey.controller.js";
 const licenceKeyRoute=Router()

 licenceKeyRoute.route("/create").post(createLicenceKey)
 licenceKeyRoute.route("/authKey").post(authKey)




export  {licenceKeyRoute}