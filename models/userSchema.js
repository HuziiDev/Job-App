import mongoose from "mongoose";
import validator from "validator";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const userSchema =new mongoose.Schema({
    name: {
        type: String,
        required: [true,"Please provide a Name"],
        minLength:[3, "Name must contain atleast three characters"],
        maxLength:[30, "Name cannot exceed 30 characters"],
    },
    email:{
        type: String,
        required: [true,"Please provide an email"],
        validate: [validator.isEmail,"Please provide an valid Email"]

    },
    phone:{
        type: Number,
        required:[true, "Please provide a phone number"]
    },
    password:{
        type: String,
        required: [true, "Please provide a password"],
        minLength:[8,"Password length must be atlease 8 characters"],
        maxLength:[32,"Password length must not exceed 32 characters"],
        select:false,
    },
    role:{
        type: String,
        required:[true, "Please provide a required role"],
        enum: ["Job Seeker", "Employer"]
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
})

//Password Hashing
 
userSchema.pre("save", async function (next){
    if(!this.isModified("password")){
        next();
    }
       this.password = await bcrypt.hash(this.password,10);
})

//Compairing password

userSchema.methods.comparePassword = async function (enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password)
}

//Generating a JWT token
userSchema.methods.getJWTToken =  function(){
    return jwt.sign({id: this._id}, process.env.JWT_SECRET_KEY,{
        expiresIn: process.env.JWT_EXPIRE
    })
}

export const User = mongoose.model('user', userSchema)