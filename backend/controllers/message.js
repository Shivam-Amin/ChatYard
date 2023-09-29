import { ErrorHandler } from "../middleware/err.js";
import { Message } from "../models/messageModel.js";
import { User } from "../models/userModel.js";

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
        var latestMessage = await Message.create(newMessage);
        latestMessage = await latestMessage.populate("sender", "name pic")
        latestMessage = await latestMessage.populate("chat")
        latestMessage = await User.populate(latestMessage, {
            path: "chat.users",
            select: "name pic yardID"
        })

    } catch (error) {
        next(error);
    }
}

const getAllMessages = async (req, res, next) => {
    try {
        const messages = await Message.find({ chat: req.params.chatId })
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