import { Project } from "../model/project.model.js";


const create=async (req,res)=>{
    const { title, description,dueDate,status,priority } = req.body;



    if ([ title, description,dueDate,status,priority].some((item) => item.trim() == "")) {
      throw new ApiError(401, "All fields are require");
    }
  
 

      const project=await Project.create({title,description,status,priority,dueData,createdBy:req.user._id,companyName:req.user.companyId})
    
      if (!project) {
        throw new ApiError(400, "Error Occur While Creating project");
      }

      res.json({
        sucess: true,
        message: "Successfully project created",
      });
}


export {create}