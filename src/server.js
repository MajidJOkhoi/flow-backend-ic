import {config} from "dotenv"
import { app } from "./app.js";
import { dbConnection } from "./dbConnection.js/db.js";
import { ApiError } from "./utlis/ApiError.js";
import cors from "cors"
import { errorMiddleware } from "./middleware/errorMiddleware.js";
config(
    {
        path:"./.env"
    }
)
app.use(cors({
    origin:process.env.ORIGIN,
    methods: ['GET,POST,PUT,DELETE,OPTIONS'],
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true // Include credentials if needed
  }))
app.use(errorMiddleware);
  

dbConnection()
.then(res=>{
    app.listen(process.env.PORT,()=>{
        console.log("server is running on Port :",process.env.PORT)
    })
})

