import { Router } from "express";
import { createComment, getAllComments, getMyComments } from "../controller/comment.controller.js";
import { auth } from "../middleware/auth.js";


 const commentRoute=Router()

 commentRoute.route("/create").post(auth,createComment)
 commentRoute.route("/getMyComments").get(auth,getMyComments)
  commentRoute.route("/getAllComments").get(getAllComments)



export  {commentRoute}