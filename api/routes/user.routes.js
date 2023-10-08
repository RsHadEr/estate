import express from "express";
import  {verifyToken}  from "../middleware/verifytoken.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";
import User from "../models/user.models.js";

const userRouter=express.Router();



userRouter.post('/update/:id',verifyToken,async (req,res,next)=>{
    if(req.user.id!=req.params.id)return next(errorHandler(401,"Not Allowed to edit this user"));
   
    try {
        if(req.body.password)
        {
            req.body.password=bcryptjs.hashSync(req.body.password,10);
        }
        const updateUser=await User.findByIdAndUpdate(req.params.id,{
            $set:{
                username:req.body.username,
                email:req.body.email,
                password:req.body.password,
                avatar:req.body.avatar

            },
        },{new:true}
        );

        const {password,...rest}=updateUser._doc;

        res.status(200).json(rest);
        
    } catch (error) {
       console.log("error");
    }

})

export default userRouter;