import mongoose from "mongoose";

export const dbConnection = () =>{
    mongoose.connect(process.env.MONGO_URI,
        {
            dbName:"JOB_SEEKING_WEBSITE_MERN_STACK"
        }
    ).then(() =>{
        console.log("Connected to database!")
    }).catch((err)=>{
           console.log(`Some error occured while connecting to the database: ${err}`)
    })
}
