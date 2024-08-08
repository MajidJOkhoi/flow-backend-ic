import { ApiError } from "../utlis/ApiError.js";
import { Attendance } from "../model/attendance.model.js";


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

const checkIn = async (req, res,next) => {
  const { checkIn } = req.body;
  const date = new Date().toDateString();
  const checkInTime = new Date().toLocaleTimeString();

  if (!checkIn) {
  return  next(new ApiError(402, "could not detect the location...."))
  }
  const exitsAttendance= await Attendance.findOne({date})

  if(exitsAttendance && exitsAttendance?.checkIn && exitsAttendance?.checkOut){
  return  next(new ApiError(400, "You cannot mark attendance more than once for the same day."))
  }

  if(exitsAttendance && exitsAttendance?.checkIn ){
  return  next(new ApiError(400, "You cannot check in more than once per day."))
  }

  const attendance = await Attendance.create({
    checkIn: { ...checkIn, time: checkInTime },
    checkOut: {},
    user: req.user._id,
    date,
  });

  if (!attendance) {
  return  next(new ApiError(400, "Error occur while checkIn  "))
  }

  res.status(200).json({
    time: attendance.checkIn.time,
    sucess: true,
    message: "Sucessfully You CheckIn.....",
  });
};

const checkOut = async (req, res,next) => {
  const { checkOut } = req.body;
  const date = new Date().toDateString();
  const checkOutTime = new Date().toLocaleTimeString();

  if (!checkOut) {
  return  next(new ApiError(402, "could not detect the location...."))
  }

  const attendance = await Attendance.findOne({
    $and: [{ date }, { user: req.user._id }],
  });

  if (!attendance) {
  return  next(new ApiError(400, "You cannot check out before checking in."))
  }

  if(attendance && attendance?.checkIn && attendance?.checkOut){
  return  next(new ApiError(400, "You cannot mark attendance more than once for the same day."))
  }

  const duration = getDuration(
    attendance.checkIn.time.toString(),
    checkOutTime.toString()
  );

  let status = "present";
  if (duration.hours < 5) {
    status = "absent";
  } else if (duration.hours > 5 && duration.hours < 7) {
    status = "early";
  } else {
    status = "present";
  }

  attendance.duration = duration;
  attendance.status = status;
  attendance.checkOut = { ...checkOut, time: checkOutTime };
  attendance.save();

  res.json({
    attendance,
    sucess: true,
    message: "Sucessfully You CheckOut.....",
  });
};

const getTodayAttendance = async (req, res,next) => {
  const _id = req?.user._id;
  const date = new Date().toDateString();

  if (!_id) {
  return  next(new ApiError(400, "unauthorized action , Login First"))
  }

  const attendance = await Attendance.findOne({
    $and: [{ date }, { user: req.user._id }],
  });

  if (!attendance) {
  return  next(new ApiError(400, "Please Make Attendance First")) 
  }

  res.json({
    attendance,
    sucess: true,
    message: "Sucessfully get today Attendance.....",
  });
};

const getMyAllAttendance = async (req, res,next) => {
  const _id = req?.user._id;
  if (!_id) {
   return next(new ApiError(400, "unauthorized action , Login First"))
  }
  const attendances = await Attendance.find({ user: req.user._id });

  if (!attendances) {
    return next(new ApiError(400, "Error occur fetching your attendance"))
  }

  res.json({
    attendances,
    sucess: true,
    message: "Sucessfully get all Attendance.....",
  });
};

const getMyMonthAttendance = async (req, res,next) => {
  let { month } = req.params;
  month = month.slice(0, 3);

  const monthAttendance = await Attendance.find({
    $and: [{ date: { $regex: month, $options: "i" } }, { user: req.user._id }],
  }).select("-user");
  if (monthAttendance && monthAttendance.length == 0) {
   return next(new ApiError(400,"No attendance record found")) 

  }

  res.json({
    success: true,
    message: "Sucessfully get the attendance of month",
    monthAttendance,
  });
};

const getAllUserAttendance=async(req,res)=>{
const usersAttendance=await Attendance.aggregate([
  {
    $lookup:{
      from:"users",
      localField:"user",
      foreignField:"_id",
      as:"user"
    }
  },
  {
 $addFields:{
  user:{$arrayElemAt:["$user",0]}
 }
  },
  {
    $project:{
      _id:1,
      checkIn:1,
      checkOut:1,
      date:1,
      duration:1,
      status:1,
      user:{_id:"$user._id",fullName:"$user.fullName",email:"$user.email"}
    }
  }
])

res.status(200).json({
  success:true,message:"successfully get all users attendance",usersAttendance
})
}

const getMyMonthAttendanceById = async (req, res,next) => {
  let { userid,month } = req.query;
  month = month.slice(0, 3);

  const monthAttendance = await Attendance.find({
    $and: [{ date: { $regex: month, $options: "i" } }, { user: userid }],
  }).select("-user");
  if (monthAttendance && monthAttendance.length == 0) {
   return next(new ApiError(400,"No attendance record found")) 

  }

  res.json({
    success: true,
    message: "Sucessfully get the attendance of month by user id",
  monthAttendance
  });
};

export {
  checkIn,
  checkOut,
  getTodayAttendance,
  getMyAllAttendance,
  getMyMonthAttendance,
  getAllUserAttendance,
  getMyMonthAttendanceById
};
