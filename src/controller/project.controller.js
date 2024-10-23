
import { Project } from "../model/project.model.js";
import { ApiError } from "../utlis/ApiError.js";

const create = async (req, res) => {
  const { title, description, dueDate, status, priority, assignMember } =
    req.body;

  if (
    [title, description, dueDate, status, priority].some(
      (item) => item.trim() == ""
    )
  ) {
    throw new ApiError(401, "All fields are require");
  }

  const project = await Project.create({
    title,
    description,
    status,
    priority,
    dueDate,
    createdBy: req.user._id,
    companyName: req.user.companyId,
    assignMember,
  });

  if (!project) {
    throw new ApiError(400, "Error Occur While Creating project");
  }

  res.json({
    sucess: true,
    message: "Successfully project created",
  });
};

const getMyProjects = async (req, res) => {
  const { _id } = req.user;
  const myProjects = await Project.aggregate([
    { $match: { createdBy: _id } },
    {
      $addFields: {
        assignMemberIds: {
          $map: { input: "$assignMember", in: { $toObjectId: "$$this" } },
        },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "assignMemberIds",
        foreignField: "_id",
        as: "assignMember",
      },
    },
    {
      $project: {
        _id: 1,
        title: 1,
        description: 1,
        status: 1,
        dueDate: 1,
        priority: 1,
        "assignMember.fullName": 1,
        "assignMember._id": 1,
      },
    },
  ]);

  res.json({
    sucess: true,
    message: "successfully get all my projects",
    myProjects,
  });
};

const getAssginMembersByProjectId = async (req, res, next) => {
  const { _id } = req.params;
  if(!_id) {
    return next(new ApiError(400,"ProjectId  is  required"))
  }
  const project = await Project.findOne({_id}).populate('assignMember')
  if(!project) {
    return next(new ApiError(400,"This project does not exist"))
  }
  
  const assignMembers=project?.assignMember.map(assignMember => ({_id:assignMember._id,fullName:assignMember.fullName,email:assignMember.email}))
  res.json({
    sucess: true,
    message: "Successfully get all assgin members of this project",
    assignMembers
  });
};

export { create, getMyProjects,getAssginMembersByProjectId };
