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
const corsOptions = {
    origin: '*', // Replace with your frontend's URL
    methods: ['GET','POST','PUT','DELETE','OPTIONS'],
    credentials: true, // Allow credentials like cookies to be sent
  };
app.use(cors(corsOptions))


app.options('*', cors(corsOptions));

app.use(errorMiddleware);
  

dbConnection()
.then(res=>{
    app.listen(process.env.PORT,()=>{
        console.log("server is running on Port :",process.env.PORT)
    })
})

