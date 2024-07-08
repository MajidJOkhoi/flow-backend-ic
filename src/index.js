import {config} from "dotenv"
import { app } from "./app.js";
import { dbConnection } from "./dbConnection.js/db.js";
config(
    {
        path:"./.env"
    }
)


dbConnection()
.then(res=>{
    app.listen(process.env.PORT,()=>{
        console.log("server is running on Port :",process.env.PORT)
    })
})

