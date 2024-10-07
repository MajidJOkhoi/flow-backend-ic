import { Router } from "express";
import { createComment, deleteComment, getAllComments, getMyComments, updateComment } from "../controller/comment.controller.js";
import { auth } from "../middleware/auth.js";


 const commentRoute=Router()

 commentRoute.route("/create").post(auth,createComment)
 commentRoute.route("/getMyComments").get(auth,getMyComments)
commentRoute.route("/getAllComments").get(getAllComments)
commentRoute.route("/delete/:_id").delete(deleteComment)
commentRoute.route("/update/:_id").put(updateComment)


export  {commentRoute}