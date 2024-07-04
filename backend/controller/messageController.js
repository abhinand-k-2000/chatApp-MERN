import asyncHandler from "express-async-handler";
import Message from '../models/messageModel.js'
import User from "../models/userModel.js";
import Chat from "../models/chatModel.js";


export const sendMessage = asyncHandler(async(req, res) => {

    const {content, chatId} = req.body
    console.log(req.body)
    
    if(!content || !chatId) {
        console.log("Invalid data passed");
        return res.sendStatus(400)
    }

    let newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId
    }

    try {
        let message = await Message.create(newMessage)

        message = await message.populate("sender", "name")
        message = await message.populate("chat")
        message = await User.populate(message, {
            path: "chat.users",
            select: 'name email'
        })

        await Chat.findByIdAndUpdate(chatId, {
            latestMessage: message
        })
        res.json(message)
    } catch (error) {
        throw new Error(error.message)
    }
})


export const allMessages = asyncHandler(async(req, res) => {

    try {
        const messages = await Message.find({chat: req.params.chatId}).populate("sender", 'name email')
        .populate('chat');

        res.json(messages)
    } catch (error) {
        console.log(error)
    }
})     