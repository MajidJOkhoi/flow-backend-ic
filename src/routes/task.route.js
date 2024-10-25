import { Router } from "express";
import { createTask, getTaskByProjectId } from "../controller/Task.controller.js";

 const taskRoute=Router()

 taskRoute.route("/create").post(createTask)
taskRoute.route("/getTaskByProjectId/:projectId").get(getTaskByProjectId)
export  {taskRoute}