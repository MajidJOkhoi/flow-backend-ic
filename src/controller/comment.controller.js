import { ApiError } from "../utlis/ApiError.js";
import { Comment } from "../model/comment.model.js";

const createComment = async (req, res, next) => {
  const { content } = req.body;
  if (content.trim() == "") {
    return next(new ApiError(400, "Message is required"));
  }

  const comment = await Comment.create({ content, commentBy: req.user._id });

  if (!comment) {
    return next(new ApiError(400, "Error occur while creating comment "));
  }

  res.status(200).json({success:true,message:"Successfully comment created"})
};


const getMyComments=async(req,res)=>{
  const myComments=await Comment.aggregate([
    {
        $match:{commentBy:req.user._id}
    },

   {
    $project:{
        content:1,
        createdAt:1,
        _id:1
    }
   }

  ])

  res.status(200).json({success:true,message:"Successfully get all my comments",myComments})
}

const getAllComments=async(req,res)=>{
    const allComments=await Comment.aggregate([
    
  {
    $lookup:{
        from:"users",
        localField:"commentBy",
        foreignField:"_id",
        as:"commentBy"
    }
  },
  {
  $addFields:{
    commentBy:{$arrayElemAt:["$commentBy",0]}
  }
  },
     {
      $project:{
          commentBy:"$commentBy.fullName",
          content:1,
          createdAt:1,
          _id:1
      }
     }
  
    ])
  
    res.status(200).json({success:true,message:"Successfully get all  comments",allComments})
  }

export { createComment,getMyComments,getAllComments };
