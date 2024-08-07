import { Leave } from "../model/leave.model.js";
import { ApiError } from "../utlis/ApiError.js";
const applyLeave = async (req, res, next) => {
  try {
    const { description, teamHead, intialDate, endDate, totalDays } = req.body;

    if (
      [description, teamHead, intialDate, endDate].some(
        (item) => item.trim() == ""
      )
    ) {
      return next(new ApiError(400, "All fields are require"));
    }

    const leave = await Leave.create({
      description,
      teamHead,
      user: req.user._id,
      intialDate,
      endDate,
      totalDays,
    });

    if (!leave) {
      return next(new ApiError(400, "Error occur while apply for leave"));
    }

    res.status(200).json({
      success: true,
      message: "successfully apply for leave",
    });
  } catch (err) {
    next(err);
  }
};
const getAllLeaves = async (req, res, next) => {
  const allLeaves = await Leave.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "teamHead",
        foreignField: "_id",
        as: "teamHead",
      },
    },

    {
      $project: {
        description: 1,
        intialDate: 1,
        endDate: 1,
        totalDays: 1,
        user: { $arrayElemAt: ["$user", 0] },
        teamHead: { $arrayElemAt: ["$teamHead", 0] },
      },
    },
  ]);

  if (!allLeaves) {
    return next(new ApiError(400, "Error occur while fetching all leaves"));
  }

  res.status(200).json({
    success: true,
    message: "successfully get all leaves",
    allLeaves,
  });
};
export { applyLeave, getAllLeaves };
