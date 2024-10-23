import { Router } from "express";
import { createTask } from "../controller/Task.controller.js";

 const taskRoute=Router()

 taskRoute.route("/create").post(createTask)

export  {taskRoute}