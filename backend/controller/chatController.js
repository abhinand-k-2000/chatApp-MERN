import asyncHandler from "express-async-handler";
import Chat from "../models/chatModel.js";
import User from "../models/userModel.js";

export const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  console.log(userId)

  if (!userId) {
    console.log("UserId param not sent with req");
    return res.sendStatus(400);
  }

  var isChat = await Chat.find({ isGroupChat: false, 
    $and: [
        {users: {$elemMatch: {$eq: req.user._id}}},
        {users: {$elemMatch: {$eq: userId}}}
    ]
   }).populate("users", "-password").populate("latestmessage")

   isChat = await User.populate(isChat, {
    path: 'latestMessage.sender', 
    select: "name, email"
   })

   if(isChat.length > 0) {
    res.send(isChat[0]);
   }else {
    var chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [req.user._id, userId]
    }

    try {
        const createdChat = await Chat.create(chatData)
        const fullChat = await Chat.findOne({_id: createdChat._id}).populate("users", "-password");

        res.status(200).send(fullChat)
    } catch (error) {
        throw new Error(error.message)
    }
   }
});



export const fetchChats = asyncHandler(async(req, res) => {
    try {
       const allChat = await Chat.find({users: {$elemMatch: {$eq: req.user._id}}})
       .populate("users", "-password")
       .populate("groupAdmin", "-password")
       .populate("latestMessage")
       .sort({updatedAt: -1})

       const result = await User.populate(allChat, {
        path: "latestMessage.sender",
        select: "name email"
       })

       res.status(200).send(result)
    } catch (error) {
        res.status(400);
        throw new Error(error.message)
    }
})


export const createGroupChat = asyncHandler(async (req, res) => {
    if(!req.body.users || !req.body.name) {
        return res.status(400).send({message: "Please fill all the fields"})
    } 

    var users = JSON.parse(req.body.users);

    if(users.length < 2) {
        return res.status(400).send("More than 2 users are required to form a group chat");
    }

    users.push(req.user._id)

    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user._id
        })

        const fullGroupChat = await Chat.findOne({_id: groupChat._id})
        .populate("users", "-password")
        .populate("groupAdmin", "-password")

        return res.status(200).json(fullGroupChat)

    } catch (error) {
        res.status(400);
        throw new Error(error.message)
    }
})

export const renameGroup = asyncHandler(async (req, res) => {
    const {chatId, chatName} = req.body;

    try {
        const updatedChat = await Chat.findByIdAndUpdate(chatId, {chatName: chatName}, {new: true})
    .populate("users", "-password")
    .populate("groupAdmin", "-password")

    if(!updatedChat){
        res.status(404)
        throw new Error("Chat not found")
    }else{
        res.json(updatedChat)
    }
    } catch (error) {
        console.log(error)
    }
})


export const addToGroup = asyncHandler(async(req, res) => {
    try {
        const {chatId, userId}  = req.body

    const added = await Chat.findByIdAndUpdate(chatId, {
        $push: {users: userId}
    }, {new: true})
    .populate("users", "-password")
    .populate("groupAdmin", "-password")

    if(!added){
        res.status(404)
        throw new Error("Chat not found")
    }else {
        res.json(added)
    }
    } catch (error) {
        console.log(error)
    }
})


export const removeFromGroup = asyncHandler(async (req, res) => {
    const {chatId, userId} = req.body;
    const removed = await Chat.findByIdAndUpdate(chatId, {
        $pull: {users: userId}
    }, {new: true})
    .populate("users", "-password")
    .populate("groupAdmin", "-password")

    if(!removed){
        res.status(404)
        throw new Error("Chat not found")
    }else {
        res.json(removed)
    }
})