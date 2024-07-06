import express from 'express'
import cors from 'cors'
import userRouter from './routes/userRouter.js'
import applicationRouter from './routes/applicationRouter.js'
import jobRouter from './routes/jobRouter.js'

import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import fileUpload from 'express-fileupload'
import {dbConnection} from './database/dbConnection.js'
import {errorMiddleware} from './middlewares/error.js'
const app = express()
dotenv.config({path: './config/config.env'})



app.use(
    cors({
        origin:[process.env.FRONTEND_URL],
        methods:['GET','POST','PUT', 'DELETE'],
        credentials:true,
    })
)
app.use(cookieParser())
app.use(express.json())
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/"

}))
app.use(express.urlencoded({extended:true}))



app.use('/api/v1/user', userRouter)
app.use('/api/v1/job', jobRouter)
app.use('/api/v1/application', applicationRouter)
 dbConnection();
 app.use(errorMiddleware)







export default app