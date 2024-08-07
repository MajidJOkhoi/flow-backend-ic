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

app.use(errorMiddleware);
  

dbConnection()
.then(res=>{
    app.listen(process.env.PORT,()=>{
        console.log("server is running on Port :",process.env.PORT)
    })
})

