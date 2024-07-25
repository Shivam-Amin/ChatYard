import { ErrorHandler } from "../middleware/err.js";
import { Message } from "../models/messageModel.js";
import { User } from "../models/userModel.js";
import { Chat } from "../models/chatModel.js";

const sendMessage = async (req, res, next) => {
    const { message, chatId } = req.body;

    if (!message || !chatId) {
        console.log("Invalid data passed into request...");
        return res.sendStatus(400);
    }

    var newMessage = {
        sender: req.user._id,
        message: message,
        chat: chatId,
    };

    try {
        var msg = await Message.create(newMessage);
        msg = await msg.populate("sender", "name pic")
        msg = await msg.populate("chat")
        msg = await User.populate(msg, {
            path: "chat.users",
            select: "name pic yardID"
        })

        await Chat.findByIdAndUpdate(chatId, {
            latestMessage: msg
        })

        res.json(msg);
    } catch (error) {
        next(error);
    }
}

const getAllMessages = async (req, res, next) => {
    try {
        const messages = await Message.find({ 
            chat: req.params.chatId 
        })
        .populate("sender")
        .populate("chat");

        res.json(messages);
    } catch (error) {
        next(error);
    }
}

export {
    sendMessage,
    getAllMessages,
}