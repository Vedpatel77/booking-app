import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoute from './routes/auth.js';
import usersRoute from './routes/users.js';
import hotelsRoute from './routes/hotels.js';
import roomsRoute from './routes/rooms.js';
import cookieParser from 'cookie-parser';
import cors from 'cors'

const app = express()
const port = 5000
dotenv.config()

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('db connected successfully.')
    } catch (error) {
        throw error;
    }
}

mongoose.connection.on("disconnected",()=>{
    console.log("Mongodb disconnected!")
})

//middleware
app.use(cors())
app.use(cookieParser())
app.use(express.json())

app.use("/api/v1/auth",authRoute)
app.use("/api/v1/users",usersRoute)
app.use("/api/v1/hotels",hotelsRoute)
app.use("/api/v1/rooms",roomsRoute)

app.use((err,req,res,next)=>{
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "something went wrong!";
    return res.status(errorStatus).json({
        success: false, 
        status: errorStatus,
        message: errorMessage,
        stack: err.stack
    })
})


app.listen(port, () => {
    connect()
    console.log("backend connected successfuly...")
    console.log(`backend server is running on http://localhost:${port}/`);
})