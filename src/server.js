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
    methods: 'GET,POST,PUT,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true, // Allow credentials like cookies to be sent
  };
app.use(cors(corsOptions))


app.options('*', cors(corsOptions));

app.use(errorMiddleware);
  
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://flow-ic-web.vercel.app'); // Allow localhost in dev
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
        return res.status(200).json({});
    }
    next();
});

dbConnection()
.then(res=>{
    app.listen(process.env.PORT,()=>{
        console.log("server is running on Port :",process.env.PORT)
    })
})

