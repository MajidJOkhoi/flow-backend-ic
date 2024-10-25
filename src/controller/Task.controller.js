import { Project } from "../model/project.model.js";
import { Task } from "../model/Task.model.js";
import { ApiError } from "../utlis/ApiError.js";
const createTask = async (req, res, next) => {
  const { taskTitle, description, dueDate, assignMember, projectId } = req.body;
  if ([taskTitle, description, dueDate].some((item) => item.trim() === "")) {
    return next(new ApiError(400,"ALl fields are required"))
  }
  if (!projectId) {
    return next(new ApiError(400, "project is required"));
  }

  if (assignMember?.length == 0) {
    return next(new ApiError(400, "Please select at least one member"));
  }

  const findProject = await Project.findOne({ _id: projectId });

  if (!findProject) {
    return next(new ApiError(400, "This project does not exist"));
  }
  const existsTask=await Task.findOne({ taskTitle});

  if (existsTask) {
    return next(new ApiError(400, "This task already exists"));
  }

  const task = await Task.create({
    taskTitle,
    description,
    dueDate,
    assignMember,
    projectId,
  });

  
  if (!task) {
    return next(new ApiError(400, "Error occur while creating task"));
  }

  res.status(200).json({success: true,message:"Successfully created task"});
};

const getTaskByProjectId = async (req, res, next) => {
  const { projectId } = req.params;
  if (!projectId) {
    return next(new ApiError(400, "project is required"));
  }
  const tasks = await Task.find({ projectId }).populate("assignMember");
  if (!tasks) {
    return next(new ApiError(400, "Error occur While retrieving tasks"));
  }

  res.status(200).json({success: true, message:"Task successfully retrieved",tasks})

}
export {createTask,getTaskByProjectId}