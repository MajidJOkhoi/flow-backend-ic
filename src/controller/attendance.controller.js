import { ApiError } from "../utlis/ApiError.js";
import { Attendance } from "../model/attendance.model.js";
import mongoose from "mongoose";
import { User } from "../model/user.model.js";
import geolib from "geolib";

function parseTimeString(timeString) {
  const [time, modifier] = timeString.split(" ");
  let [hours, minutes, seconds] = time.split(":").map(Number);

  if (modifier === "PM" && hours !== 12) {
    hours += 12;
  }
  if (modifier === "AM" && hours === 12) {
    hours = 0;
  }

  return hours * 3600 + minutes * 60 + seconds;
}

function getDuration(startTime, endTime) {
  const startSeconds = parseTimeString(startTime);
  let endSeconds = parseTimeString(endTime);

  if (endSeconds < startSeconds) {
    endSeconds += 24 * 3600; // Add 24 hours in seconds
  }

  const durationSeconds = endSeconds - startSeconds;
  const hours = Math.floor(durationSeconds / 3600);
  const minutes = Math.floor((durationSeconds % 3600) / 60);
  const seconds = durationSeconds % 60;

  return { hours, minutes, seconds };
}

const checkLocation = async (longitude, latitude) => {
  const userLocation = { latitude, longitude };
  const centerPoint = { latitude: 26.231801, longitude: 68.388698 };
const allowedRadius = 7.12;
const distance = geolib.getDistance(centerPoint, userLocation);
let status=false
if (distance <= allowedRadius) {
  status=true
} 

  return status;
};

const checkIn = async (req, res, next) => {
  const { checkIn, date } = req.body;

  if (!checkIn) {
    return next(new ApiError(400, "could not detect the location..."));
  }

  const exitsAttendance = await Attendance.findOne({
    $and: [{ date }, { user: req.user._id }],
  });

  if (
    exitsAttendance &&
    exitsAttendance?.checkIn &&
    exitsAttendance?.checkOut
  ) {
    return next(
      new ApiError(
        400,
        "You cannot mark attendance more than once for the same day."
      )
    );
  }

  if (exitsAttendance && exitsAttendance?.checkIn) {
    return next(
      new ApiError(400, "You cannot check in more than once per day.")
    );
  }

  let locationStatus = await checkLocation(checkIn.longitude, checkIn.latitude);

  if (!locationStatus) {
    return next(new ApiError(400, "You are outside the office"));
  }

  const attendance = await Attendance.create({
    checkIn,
    user: req.user._id,
    date,
  });

  if (!attendance) {
    return next(new ApiError(400, "Error occur while checkIn  "));
  }

  res.status(200).json({
    sucess: true,
    message: "Sucessfully you checkIn",
    time: attendance.checkIn.time,
  });
};

const checkOut = async (req, res, next) => {
  const { checkOut, date } = req.body;

  if (!checkOut) {
    return next(new ApiError(402, "could not detect the location...."));
  }

  const attendance = await Attendance.findOne({
    $and: [{ date }, { user: req.user._id }],
  });

  if (!attendance) {
    return next(new ApiError(400, "You cannot check out before checking in."));
  }

  if (attendance && attendance?.checkIn && attendance?.checkOut) {
    return next(
      new ApiError(
        400,
        "You cannot mark attendance more than once for the same day."
      )
    );
  }

  const locationStatus = await checkLocation(
    checkOut.longitude,
    checkOut.latitude
  );

  if (!locationStatus) {
    return next(new ApiError(400, "You are outside the office"));
  }

  const duration = getDuration(
    attendance.checkIn.time.toString(),
    checkOut.time.toString()
  );

  let status = "absent";
  if (
    attendance.checkIn.latitude <= 26.2318869 ||
    attendance.checkIn.latitude >= 26.23181
  ) {
    status = "present";
  }

  attendance.duration = duration;
  attendance.status = status;
  attendance.checkOut = checkOut;
  attendance.save();

  res.status(200).json({
    sucess: true,
    message: "Sucessfully You CheckOut.....",
    attendance,
  });
};

const getTodayAttendance = async (req, res, next) => {
  const _id = req?.user._id;
  const date = req.params.date;

  if (!_id) {
    return next(new ApiError(400, "unauthorized action , Login First"));
  }

  const attendance = await Attendance.aggregate([
    {
      $match: { $and: [{ date }, { user: req.user._id }] },
    },
  ]);

  if (attendance.length == 0) {
    return next(new ApiError(400, "No attendance found for today."));
  }

  res.json({
    attendance,
    sucess: true,
    message: "Sucessfully get today Attendance.....",
  });
};

const getMyAllAttendance = async (req, res, next) => {
  const _id = req?.user._id;
  if (!_id) {
    return next(new ApiError(400, "unauthorized action , Login First"));
  }
  const attendances = await Attendance.find({ user: req.user._id });

  if (!attendances) {
    return next(new ApiError(400, "Error occur fetching your attendance"));
  }

  res.json({
    attendances,
    sucess: true,
    message: "Sucessfully get all Attendance.....",
  });
};

const getMyMonthAttendance = async (req, res, next) => {
  let { month } = req.params;
  month = month.slice(0, 3);

  const monthAttendance = await Attendance.find({
    $and: [{ date: { $regex: month, $options: "i" } }, { user: req.user._id }],
  }).select("-user");
  if (monthAttendance && monthAttendance.length == 0) {
    return next(new ApiError(400, "No attendance record found"));
  }

  res.json({
    success: true,
    message: "Sucessfully get the attendance of month",
    monthAttendance,
  });
};

const getAllUserAttendance = async (req, res) => {
  const usersAttendance = await Attendance.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $addFields: {
        user: { $arrayElemAt: ["$user", 0] },
      },
    },
    {
      $project: {
        _id: 1,
        checkIn: 1,
        checkOut: 1,
        date: 1,
        duration: 1,
        status: 1,
        user: {
          _id: "$user._id",
          fullName: "$user.fullName",
          email: "$user.email",
        },
      },
    },
  ]);

  res.status(200).json({
    success: true,
    message: "successfully get all users attendance",
    usersAttendance,
  });
};

const getMyMonthAttendanceById = async (req, res, next) => {
  let { userid, month } = req.query;
  month = month.slice(0, 3);
  userid = new mongoose.Types.ObjectId(userid);
  const monthAttendance = await Attendance.aggregate([
    {
      $match: {
        $and: [{ date: { $regex: month, $options: "i" } }, { user: userid }],
      },
    },

    {
      $project: {
        checkIn: "$checkIn.time",
        checkOut: "$checkOut.time",
        date: "$date",
        duration: 1,
      },
    },
  ]);

  if (monthAttendance && monthAttendance.length == 0) {
    return next(new ApiError(400, "No attendance record found"));
  }

  res.json({
    success: true,
    message: "Sucessfully get the attendance of month by user id",
    monthAttendance,
  });
};
//this is for admin
const countTodayAttendies = async (req, res, next) => {
  const date = new Date().toLocaleDateString();

  const TotalAttendies = await Attendance.find({ date });
  if (!TotalAttendies) {
    next(
      new ApiError(400, "Error occur while fetching today Attendies record")
    );
  }

  const count = TotalAttendies.length;

  res.status(200).json({
    success: true,
    message: "Successfully get count of today attendies",
    count,
  });
};

const getMyTeamMemberTodayAttendanceRecord = async (req, res, next) => {
  const date = new Date().toDateString();
  let totalUser;
  let onlineUserAttendanceRecord = await Attendance.aggregate([
    {
      $match: { date },
    },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $addFields: {
        user: {
          $arrayElemAt: ["$user", 0],
        },
      },
    },
  ]);

  totalUser = (await User.find({ status: false })).length;

  //check that if user is Team lead then show him only his team member attendance which are currently checkIn
  if (req.user.role == "2") {
    totalUser = await (
      await User.find({ createdBy: req.user._id, status: false })
    ).length;
    onlineUserAttendanceRecord = onlineUserAttendanceRecord.filter((item) => {
      if (
        item.user.createdBy.toString() === req.user._id.toString() &&
        item.checkOut == undefined
      ) {
        return item;
      }
    });
  }

  //this filter is for admin to see user which are currently checkIn
  onlineUserAttendanceRecord = onlineUserAttendanceRecord.filter((item) => {
    if (item.checkOut == undefined) {
      return item;
    }
  });

  res.status(200).json({
    success: true,
    message: "Successfully get my team members today attendance status",
    onlineUserAttendanceRecord,
    totalUser,
  });
};

const myWorkingHours = async (req, res) => {
  let { month } = req.params;
  month = month.slice(0, 3);
  let workingHours = await Attendance.aggregate([
    {
      $match: {
        $and: [
          { date: { $regex: month, $options: "i" } },
          { user: req.user._id },
        ],
      },
    },
    {
      $group: {
        _id: "$user",
        minutes: {
          $sum: "$duration.minutes",
        },
        hours: {
          $sum: "$duration.hours",
        },
      },
    },
    {
      $project: {
        minutes: 1,
        hours: 1,
      },
    },
  ]);

  const workingMinutes = workingHours[0]?.minutes + workingHours[0]?.hours * 60;
  res.status(200).json({
    success: true,
    message: "Successfully get my working hours",
    workingMinutes,
  });
};

const getTodayAbsentUsers = async (req, res, next) => {
  const _id = req.user._id.toString();
  const todayDate = new Date().toDateString();
  const attendedUsers = await Attendance.find({ date: todayDate }).distinct(
    "user"
  );

  let absentUsers = await User.aggregate([
    {
      $match: { _id: { $nin: attendedUsers } },
    },
    {
      $lookup: {
        from: "jobtypes",
        localField: "jobType",
        foreignField: "id",
        as: "jobtype",
      },
    },
    {
      $lookup: {
        from: "designations",
        localField: "designation",
        foreignField: "id",
        as: "designation",
      },
    },
    {
      $addFields: { designation: { $arrayElemAt: ["$designation", 0] } },
    },
    {
      $addFields: { jobtype: { $arrayElemAt: ["$jobtype", 0] } },
    },
    {
      $project: {
        designation: "$designation.name",
        jobType: "$jobtype.name",
        fullName: 1,
        createdBy: 1,
      },
    },
  ]);
  absentUsers = absentUsers.filter((user) => _id != user._id);
  if (req.user.role == "2") {
    absentUsers = absentUsers.filter(
      (user) => _id == user?.createdBy?.toString()
    );
  }

  res.status(200).json({
    success: true,
    message: "successfully get all Absent Users ",
    absentUsers,
    count: absentUsers.length,
  });
};

const getTodayPresentUsers = async (req, res, next) => {
  const _id = req.user._id.toString();
  const date = new Date().toDateString();
  let presentUsers = await Attendance.aggregate([
    {
      $match: { $and: [{ date }, { checkOut: { $exists: true } }] },
    },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $addFields: {
        user: {
          $arrayElemAt: ["$user", 0],
        },
      },
    },
    {
      $project: {
        checkIn: "$checkIn.time",
        checkOut: "$checkOut.time",
        duration: 1,
        fullName: "$user.fullName",
        date: 1,
        teamHeadId: "$user.createdBy",
      },
    },
  ]);
  presentUsers.filter((user) => _id != user._id.toString());
  if (req.user.role == "2") {
    presentUsers = presentUsers.filter(
      (user) => _id == user?.teamHeadId.toString()
    );
  }
  res.status(200).json({
    status: true,
    message: "get All present users",
    presentUsers,
    count: presentUsers.length,
  });
};

const deleteAttendance = async (req, res,next) => {
  const attendanceId = req.params.id;
  await Attendance.deleteOne({ _id: attendanceId });

  res.status(200).json({
    success: true,
    message: "Attendance Deleted",
  });
};
const updateAttendance=async(req,res,next)=>{
const {attendanceId}=req.params
const {startTime,endTime}=req.body

const attendance=await Attendance.findOne({_id:attendanceId})
console.log(attendance)
if(!attendance){
  return next(new ApiError(400, "No attendance record found"));
}
const {checkIn,checkOut}=attendance
attendance.checkIn={...checkIn,time:startTime} || attendance.checkIn
attendance.checkOut={...checkOut,time:endTime}  || attendance.checkOut

await attendance.save()

res.status(200).json({success:true,message:"Succesfully Updated Attendance"})
}

export {
  checkIn,
  checkOut,
  getTodayAttendance,
  getMyAllAttendance,
  getMyMonthAttendance,
  getAllUserAttendance,
  getMyMonthAttendanceById,
  countTodayAttendies,
  getMyTeamMemberTodayAttendanceRecord,
  myWorkingHours,
  getTodayAbsentUsers,
  getTodayPresentUsers,
  deleteAttendance,
  updateAttendance
};
