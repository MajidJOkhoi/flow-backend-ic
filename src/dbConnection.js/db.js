import mongoose from "mongoose"


const dbConnection =async()=>{
    try {
       const connection=await mongoose.connect(`${process.env.DB_URL}/i_Attendace`) 
      console.log("Db Connected")
    } catch (error) {
        console.log("Error: while connecting with database",error)
    }
}
export {dbConnection}