
import asyncHandler from 'express-async-handler'
import generateToken from '../utils/generateToken.js'
import User from '../models/userModel.js'


export const registerUser = asyncHandler(async(req, res) => {
    const {name, email, password} = req.body
    if(!name || !email || !password) {    
        throw new Error("Every fields are required")
    }

    const existingUser = await User.findOne({email: email})
    if(existingUser){
        res.status(400);
        throw new Error("User already exists")
    }

    const newUser = await User.create({
        email, name, password
    })

    const token = generateToken(newUser._id)

    if(newUser){
        res.status(201).json({staus: true, _id: newUser._id, name: newUser.name, email: newUser.email, token })
    }else {
        res.status(400);
        throw new Error("User not found")
    }

})


export const authUser = asyncHandler(async (req, res) => {
    const {email, password} = req. body

    console.log("indise login: ", email)

    const user = await User.findOne({email})
    const token = generateToken(user._id)
    const matchPassword = await  user.matchPassword(password)
      


    if(user && matchPassword){
        console.log("insdifsldfjlkjasdklfjklashjf", matchPassword)
        res.json({
             _id: user._id, name: user.name, email: user.email, token
        })
    }else {
        res.status(401);
        throw new Error("Invalid Email or Password")
    }
})


export const allUsers = asyncHandler(async (req, res) => {
    console.log(req.query)
    console.log(req.user)
    const keyword = req.query.search ? {
        $or: [
            {name: {$regex: req.query.search, $options: 'i'}},
            {email: {$regex: req.query.search, $options: 'i'}}
        ]
    } : {}

    const users = await User.find(keyword).find({_id: {$ne: req.user._id}})
    res.send(users)
})