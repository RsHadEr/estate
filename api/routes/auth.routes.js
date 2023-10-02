import express from "express";
import User from "../models/user.models.js";
import bcryptjs from "bcryptjs";
const authRouter=express.Router();


authRouter.post("/signup",async (req,res,next)=>{
const {username,email,password}=req.body;
const hashedPassword=bcryptjs.hashSync(password,10);
const user=new User({username,email,password:hashedPassword});
try{
await user.save();
res.status(201).json({message:"usercreated"});
}catch(err)
{
    next(err);
}
});


export default authRouter;