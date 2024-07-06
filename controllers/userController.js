import {catchAsyncError} from '../middlewares/catchAsyncError.js'
import {User} from '../models/userSchema.js'
import { sendToken } from '../utils/jwtToken.js';
import {ErrorHandler} from '../middlewares/error.js'




export const register = catchAsyncError(async(req, res, next) =>{
    const {name, email, password, role, phone} = req.body;
    if(!name || !email || !password || !role || !phone){
    return next(new ErrorHandler("Please fill full registration form!"))
    }
     const isEmail = await User.findOne({email})
     if(isEmail){
        return next(new ErrorHandler("Email already exists!"))
     }

     const user = await User.create({
        name,
        email, 
        phone, 
        role,
        password
     })

     sendToken(user, 200, res, "User Registered!");
})

export const login = catchAsyncError(async(req, res, next) =>{
    const {email, password, role}= req.body;

    if(!email || !password || !role){
        return next(new ErrorHandler("Please provide appropriate email, password or role",400))
    }


    const user = await User.findOne({email}).select("+password");

    if(!user){
        return next (new ErrorHandler("Invalid email or password",400))
    }
        const isPasswordMatched = await user.comparePassword(password);
        if(!isPasswordMatched){
            return next (new ErrorHandler("Invalid email or password",400))
        }
if(user.role!=role){
   return next (new ErrorHandler("User with this role not found",400))

}


sendToken(user, 200, res, "User Logged in!");

})

export const logout = catchAsyncError(async(req, res, next) => {
    res.status(201).cookie("token","",{
        httpOnly: true,
        expires: new Date(Date.now()),
    }).json({
        success:true,
        message:"User logged out successfully!"
    })
})