import User from "../models/user.model.js"
import jwt from "jsonwebtoken"
import validator from "validator"
import bcrypt from "bcrypt"


export const userSignup = async(req,res)=>{
    const {name, email, password} = req.body
    let role = req.body.role ?? "user";

    if(!name || !email || !password)
    {
        return res.status(400).json({message:"KIndly fill all of the fields"})
    }

    else if(!validator.isEmail(email))
    {
        return res.status(400).json({message:"Please enter a valid email id!"})
    }

    const isUserExisting = await User.findOne({email})

    if(isUserExisting)
    {
        return res.status(409).json({message:"User with this email already exists!"})
    }

    try {
        const hashedPassword = await bcrypt.hash(password,10)
        await User.create({
            email,
            password:hashedPassword,
            name,
            role
        })

        return res.status(201).json({message:`User ${name} created successfully!`})

    } catch (e) {
        console.error("Error creating the user!")
        return res.status(500).json({message:`Error creating the user: ${e}`})
    }
}


export const userLogin = async(req,res)=>{
    const {email, password} = req.body

    if(!email || !password)
    {
        return res.status(400).json({message:"Please enter your email and password!"})
    }

    if(!validator.isEmail(email))
    {
        return res.status(400).json({message:"Please enter a valid email!"})
    }

    try {
        const user = await User.findOne({email})

        if(user)
        {
            return res.status(404).json({message:"User not found. Please enter valid credentials!"})
        }

        const passMatch = bcrypt.compare(password, user.password)
        if(!passMatch)
        {
            return res.status(400).json({message:"Incorrect Password!"})
        }

        const token = jwt.sign(
            {id:user._id, name:user.name},
            process.env.JWT_SECRET,
            {expiresIn:"1h"}
        )
        const userDets = await User.findOne({email}).select("name email role")

        return res.status(200).json({
            message:"User logged in successfully!",
            user:userDets,
            token
        })
    } catch (e) {
        console.error(e);
    return res.status(500).json({message: "Login failed!",details: e.message});
    }
}