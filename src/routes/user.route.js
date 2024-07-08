import { Router } from "express";
import { create, login } from "../controller/user.controller.js";


 const router=Router()


router.route("/create").post(create)
router.route("/login").post(login)


export default router