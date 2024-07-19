import { Router } from "express";
import { createLicenceKey, getLicenceKey } from "../controller/licenceKey.controller.js";
 const licenceKeyRoute=Router()

 licenceKeyRoute.route("/create").post(createLicenceKey)
 licenceKeyRoute.route("/getLicenceKey").get(getLicenceKey)




export  {licenceKeyRoute}