import { Leave } from "../model/leave.model.js";
import { ApiError } from "../utlis/ApiError.js";
import { cloudinaryUpload } from "../utlis/cloudinary.js";
import { sendMail } from "../utlis/sendMail.js";

const applyLeave = async (req, res, next) => {
  try {
    const {
      description,
      teamHead,
      intialDate,
      endDate,
      totalDays,
      teamLeadEmail,
      teamLeadName,
      applydate,
      leaveType
    } = req.body;
    const filePath = req.file?.path;
    let cloudImagePath;
    if ([description, teamHead].some((item) => item.trim() == "")) {
      return next(new ApiError(400, "All fields are require"));
    }

    if (filePath) {
      cloudImagePath = await cloudinaryUpload(filePath);
    }
    const leave = await Leave.create({
      description,
      teamHead,
      user: req.user._id,
      intialDate,
      endDate,
      totalDays,
      image: cloudImagePath?.url || "",
      applydate,
      leaveType
    });

    if (!leave) {
      return next(new ApiError(400, "Error occur while apply for leave"));
    }
    const subject = "Request for leave";
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Leave Request</title>
  <style>
    @import url('https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css');
  </style>
</head>
<body class="bg-gray-100 p-6">
  <div class="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg">
    <h1 class="text-2xl font-bold text-gray-800 mb-4">Leave Request</h1>
    <p class="text-gray-700 mb-4">Dear <strong>${teamLeadName}</strong>,</p>

    <p class="text-gray-700 mb-4">
      I am writing to formally request leave from <strong>${intialDate}</strong> to <strong>${endDate}</strong>. 
      The reason for my leave is <strong>${description}</strong>.
    </p>

    <p class="text-gray-700 mb-4">
      My total leave duration is <strong>${totalDays}</strong> days.
    </p>

   

    <p class="text-gray-700 mb-4">
      I have ensured all my tasks are handled in my absence, and will be available for any urgent issues.
    </p>

    <p class="text-gray-700 mb-4">I would appreciate your approval for this leave.</p>

    <p class="text-gray-700 mb-4">Thank you for your support.</p>

    <p class="text-gray-700">Sincerely,</p>
    <p class="text-gray-700"><strong>${req.user.fullName}</strong></p>
  </div>
</body>
</html>
`;
    //send email to admin that this user wants leave
    const mailInfo = await sendMail({
      to: teamLeadEmail,
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
      },
    },
    {
      $addFields: {
        teamHead: { $arrayElemAt: ["$teamHead", 0] },
      },
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
