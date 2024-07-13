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

const checkIn = async (req, res) => {
  const { checkIn } = req.body;
  const date = new Date().toDateString();
  const checkInTime = new Date().toLocaleTimeString();
  if (!checkIn) {
    throw new ApiError(402, "could not detect the location....");
  }
  const exitsAttendance= await Attendance.findOne({date})

  if(exitsAttendance && exitsAttendance?.checkIn && exitsAttendance?.checkOut){
    throw new ApiError(400, "You cannot mark attendance more than once for the same day.");
  }


  if(exitsAttendance && exitsAttendance?.checkIn ){
    throw new ApiError(400, "You cannot check in more than once per day.");
  }


  const attendance = await Attendance.create({
    checkIn: { ...checkIn, time: checkInTime },
    checkOut: {},
    user: req.user._id,
    date,
  });

  if (!attendance) {
    throw new ApiError(400, "Error occur while checkIn  ");
  }

  res.status(200).json({
    attendance,
    sucess: true,
    message: "Sucessfully You CheckIn.....",
  });
};

const checkOut = async (req, res) => {
  const { checkOut } = req.body;
  const date = new Date().toDateString();
  const checkOutTime = new Date().toLocaleTimeString();

  if (!checkOut) {
    throw new ApiError(402, "could not detect the location....");
  }


  const attendance = await Attendance.findOne({
    $and: [{ date }, { user: req.user._id }],
  });


  if(!attendance  ){
    throw new ApiError(400, "You cannot check out before checking in.");
  }

  if(attendance && attendance?.checkIn && attendance?.checkOut){
    throw new ApiError(400, "You cannot mark attendance more than once for the same day.");
  }

 

  const duration = getDuration(
    attendance.checkIn.time.toString(),
    checkOutTime.toString()
  );
let status="present"
  if(duration.hours <5){
status="absent"
  }else if(duration.hours >5 && duration.hours <7){
    status="early"
  }else{
    status="present"
  }

  attendance.duration = duration;
  attendance.status=status
  attendance.checkOut = { ...checkOut, time: checkOutTime };
  attendance.save();

  res.json({
    attendance,
    sucess: true,
    message: "Sucessfully You CheckOut.....",
  });
};
const getTodayAttendance = async (req, res) => {
  const _id = req?.user._id;
  const date = new Date().toDateString();

  if (!_id) {
    throw new ApiError(400, "unauthorized action , Login First");
  }

  const attendance = await Attendance.findOne({
    $and: [{ date }, { user: req.user._id }],
  });

  if (!attendance) {
    throw new ApiError(400, "Please Make Attendance First");
  }

  res.json({
    attendance,
    sucess: true,
    message: "Sucessfully get today Attendance.....",
  });

};

const getMyAllAttendance = async (req, res) => {
    const _id = req?.user._id;
    if (!_id) {
      throw new ApiError(400, "unauthorized action , Login First");
    }
    const attendances = await Attendance.find({user:req.user._id});
    
    if (!attendances) {
        throw new ApiError(400, "Error occur fetching your attendance");
      }


      res.json({
        attendances,
        sucess: true,
        message: "Sucessfully get all Attendance.....",
      });

  };
  

export { checkIn, checkOut, getTodayAttendance,getMyAllAttendance };
