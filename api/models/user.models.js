import mongoose from "mongoose";


const userSchema= new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        
    },
    avatar:{
        type:String,
        default:"https://www.google.com/imgres?imgurl=https%3A%2F%2Fcdn.pixabay.com%2Fphoto%2F2015%2F10%2F05%2F22%2F37%2Fblank-profile-picture-973460_960_720.png&tbnid=GonJG9aLPTc5LM&vet=12ahUKEwiC9v_TrN6BAxVOcWwGHW1_DRkQMygDegQIARB6..i&imgrefurl=https%3A%2F%2Fpixabay.com%2Fvectors%2Fblank-profile-picture-mystery-man-973460%2F&docid=wg0CyFWNfK7o5M&w=720&h=720&q=profile%20picture&ved=2ahUKEwiC9v_TrN6BAxVOcWwGHW1_DRkQMygDegQIARB6"
    },
},{timestamps:true});

const User=mongoose.model('User',userSchema);

export default User;