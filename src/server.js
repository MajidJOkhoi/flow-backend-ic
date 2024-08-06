import {config} from "dotenv"
import { app } from "./app.js";
import { dbConnection } from "./dbConnection.js/db.js";
import { ApiError } from "./utlis/ApiError.js";
import { errorMiddleware } from "./middleware/errorMiddleware.js";
config(
    {
        path:"./.env"
    }
)

app.use((err,req,res,next)=>{
    err.message=err.message || "Internal Server Error"
    err.statusCode=err.statusCode || 500
  
    return res.status(err.statusCode).json({ success:false,message:err.message });
});
  

dbConnection()
.then(res=>{
    app.listen(process.env.PORT,()=>{
        console.log("server is running on Port :",process.env.PORT)
    })
})

