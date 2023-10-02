import express, { response } from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/user.routes.js';
import authRouter from './routes/auth.routes.js';

const app=express();
app.use(express.json());

mongoose.connect("mongodb+srv://r2909:Rohan2909@cluster0.pgcqm20.mongodb.net/").then(()=>{
console.log("Connected to database")
}).catch((err)=>{
    console.log(err);
})


app.listen(3000,()=>{
console.log("running in 3000");
});


app.use("/api/user",userRouter);
app.use("/api/auth",authRouter);

app.use((err,req,res,next)=>{

    const statusCode=err.statusCode || 500;
    const message=err.message || 'Internal Server Error';
    return res.status(statusCode).json({
        success:false,
        statusCode,message
    });
});