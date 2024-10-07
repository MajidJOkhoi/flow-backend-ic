import { Project } from "../model/project.model.js";


const create=async (req,res)=>{
    const { title, description } = req.body;
    const createdAt=new Date().toDateString()
    if ([ title, description].some((item) => item.trim() == "")) {
      throw new ApiError(401, "All fields are require");
    }
  
 

      const project=await Project.create({title,description,createdBy:req.user._id,companyName:req.user.companyId,createdAt})
    
      if (!project) {
        throw new ApiError(400, "Error Occur While Creating project");
      }

      res.json({
        sucess: true,
        message: "Successfully project created",
        project

      });
}


export {create}