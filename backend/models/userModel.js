import { Schema, model } from "mongoose";

const UserSchema = new Schema ({
    name: String,
    email: {
        type: String,
        unique: true
    }, 
    yardID: {
        type: String,
        unique: true
    }, 
    password: {
        type: String,
        select: false
    }, 
    pic: {
        type: String,
        default: 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'
    }
}, {
    timestamps: true,
})

export const User = model("User", UserSchema);