import express from "express";
import User from "../models/user.models.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import Jwt  from "jsonwebtoken";
import * as dotenv from 'dotenv';
dotenv.config();
const authRouter=express.Router();

//api for sign up
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

//api for sign in
authRouter.post("/signin",async (req,res,next)=>{
const {email,password}=req.body;
try{
const validUser=await User.findOne({email});
if(!validUser)return next(errorHandler(404,"Invali Crediantials"));
const validPassword=bcryptjs.compareSync(password,validUser.password);
if(!validPassword)return next(errorHandler(401,"Invalid Credentials"));
const token=Jwt.sign({id:validUser._id},process.env.JWT_SECRET);
const {password:pass,...rest}=validUser._doc;
res.cookie('access_token',token,{httpOnly:true}).status(200).json(rest);



}catch(err)
{
    next(err);
}

});


export default authRouter;