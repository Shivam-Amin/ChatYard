import { app } from "./app.js";
import { connectDB } from "./db/connect.js";
import { config } from 'dotenv';
import { cloudinaryConnect } from "./db/connectCloudinary.js";
import { Server, Socket } from "socket.io";

config({
    path: '.env'
})

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB();
    await cloudinaryConnect();
    const server = app.listen(port, () => {
      console.log(`Sever is running on port ${port}...`);
    });

    const io = new Server(server, {
      pingTimeout: 60000,
      cors: {
        origin: "http://localhost:5173"
      }
    });

    io.on("connection", (socket) => {
      // console.log("Connected to socket.io");

      socket.on('setup', (user) => {
        // create server for each user by their id
        socket.join(user._id);
        socket.emit('connected');
      })

      socket.on('joinChat', (chatId) => {
        socket.join(chatId);
        // console.log("User joined: " + chatId);
      })

      socket.on('newMessage', (newMessage) => {
        var chat = newMessage.chat;
        
        if (!chat.users) return console.log('chat.users not found...');

        chat.users.forEach(user => {
          if (user._id === newMessage.sender._id) return;

          // except us send message to each user.
          socket.in(user._id).emit('RecieveMessage', newMessage);
        })
      })
    })

  } catch (error) {
    console.log(error.message);
  }
}
start();