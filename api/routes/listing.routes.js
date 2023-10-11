import express from 'express';
import { verifyToken } from '../middleware/verifytoken.js';
import Listing from '../models/listing.models.js';


const listingRouter=express.Router();


listingRouter.post('/create',verifyToken,async(req,res,next)=>{
    try {
        const listing=await Listing.create(req.body);
        return res.status(201).json(listing);
    } catch (error) {
        next(error);
    }
})










export default listingRouter;