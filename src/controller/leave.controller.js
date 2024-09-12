import { Leave } from "../model/leave.model.js";
import { ApiError } from "../utlis/ApiError.js";
import { cloudinaryUpload } from "../utlis/cloudinary.js";
import { sendMail } from "../utlis/sendMail.js";

const applyLeave = async (req, res, next) => {
  try {
    const { description, teamHead, intialDate, endDate, totalDays } = req.body;
    const filePath=req.file?.path
   let cloudImagePath;
    if (
      [description, teamHead].some(
        (item) => item.trim() == ""
      )
    ) {
      return next(new ApiError(400, "All fields are require"));
    }
 
    if(filePath){
      cloudImagePath=await cloudinaryUpload(filePath)
    }
    const leave = await Leave.create({
      description,
      teamHead,
      user: req.user._id,
      intialDate,
      endDate,
      totalDays,
      image:cloudImagePath?.url || ""
    });

    if (!leave) {
      return next(new ApiError(400, "Error occur while apply for leave"));
    }
    const subject = "Request for leave";
    const html = `<p> Hello Sir Iam ${req.user.fullName} I need Leave Reason : ${description} if you grant me Leave <br> Kindly Grant me ${totalDays} Days Leave  <br> Your Faithfully <br> ${req.user.fullName}</p>`;
    //send email to admin that this user wants leave
    const mailInfo = await sendMail({
      to: "kashifmaharofficial@gmail.com",
      subject,
      html,
    });
    if (!mailInfo) {
      return next(new ApiError(400, "Error Occur while Sending Mail to Admin"));
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
      $addFields: {
        user: { $arrayElemAt: ["$user", 0] },
      }
    },
    {
      $addFields: {
        teamHead: { $arrayElemAt: ["$teamHead", 0] },
      }
    },
    {
      $project: {
        description: 1,
        intialDate: 1,
        endDate: 1,
        totalDays: 1,
        user: {
          _id: "$user._id",
          fullName: "$user.fullName",
          email: "$user.email",
        },
        teamHead: {
          _id: "$teamHead._id",
          fullName: "$teamHead.fullName",
          email: "$teamHead.email",
        },
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
