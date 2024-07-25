import mongoose, { Schema, model } from "mongoose";

const ChatSchema = new Schema ({
    chatName: {
        type: String, 
        trim: true,
    },
    isGroupChat: {
        type: Boolean,
        default: false
    },
    groupPic: {
        type: String,
        default: 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg',
        required: function() {
            return this.isGroupChat === true;
        }
    },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    latestMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
        default: null
    },
    groupAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
}, {
    timestamps: true,
})

export const Chat = model("Chat", ChatSchema);