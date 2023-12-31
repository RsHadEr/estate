import express from "express";
import User from "../models/user.models.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import Jwt  from "jsonwebtoken";
import * as dotenv from 'dotenv';
import { verifyToken } from "../middleware/verifytoken.js";
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


//google authentication

authRouter.post('/google',async (req,res,next)=>{
try {
    const user=await User.findOne({email:req.body.email});
    if(user)
    {
        const token=Jwt.sign({id:user._id},process.env.JWT_SECRET);
        const {password:pass,...rest}=user._doc;
        res.cookie('access_token',token,{httpOnly:true}).status(200).json(rest);

    }else{
        const generatePassword=Math.random().toString(36).slice(-8)+Math.random().toString(36).slice(-8);
        const hashedPassword=bcryptjs.hashSync(generatePassword,10);
        const newUser=new User({username:req.body.name.split("").join("").toLowerCase()+Math.random().toString(36).slice(-4),email:req.body.email,password:hashedPassword,avatar:req.body.photo});
        await newUser.save();
        const token=Jwt.sign({id:newUser._id},process.env.JWT_SECRET);
        const {password:pass,...rest}=user._doc;
        res.cookie('access_token',token,{httpOnly:true}).status(200).json(rest);



    }

} catch (error) {
    next(error);
}
})


//sign out api

authRouter.get('/signout',async(req,res,next)=>{
   try {
    res.clearCookie('access_token');
    res.status(200).json("user logged out");
   } catch (error) {
    next(error);
   }

})


export default authRouter;