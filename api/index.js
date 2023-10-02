import express from 'express';
import mongoose from 'mongoose';

const app=express();

mongoose.connect("mongodb+srv://r2909:Rohan2909@cluster0.pgcqm20.mongodb.net/").then(()=>{
console.log("Connected to database")
}).catch((err)=>{
    console.log(err);
})


app.listen(3000,()=>{
console.log("running in 3000");
});