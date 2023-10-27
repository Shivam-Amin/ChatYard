import { ErrorHandler } from "../middleware/err.js";
import { Chat } from "../models/chatModel.js";
import { User } from "../models/userModel.js";

const accessChat = async (req, res, next) => {
    const { userID } = req.body;

    if (!userID) {
      return next(new ErrorHandler("Enter the user...", 404));
    }

    var isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id }}},
        { users: { $elemMatch: { $eq: userID }}}
      ]
    }).populate("users")
    .populate("latestMessage")

    isChat = await User.populate(isChat, {
      path: "latestMessage.sender",
      select: "name pic yardID"
    })

    if (isChat.length > 0) {
      res.send(isChat[0])
    } else {
      const chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [req.user._id, userID]
      }
      
      try {
        const createdChat = await Chat.create(chatData);
        const FullChat = await Chat.findOne({_id: createdChat._id}).populate("users")
        res.status(200).send(FullChat);
      } catch (error) {
        next(error)
      }
    }
}

const removeChat = async (req, res, next) => {
  try {
    const { userID } = req.body;

    if (!userID) {
      return next(new ErrorHandler("Enter the user...", 404));
    }

    var isChat = await Chat.findOneAndDelete({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id }}},
        { users: { $elemMatch: { $eq: userID }}}
      ]
    })

    isChat = await Chat.findOneAndUpdate(
      {
        isGroupChat: true,
        $and: [
          { users: { $elemMatch: { $eq: req.user._id }}},
          { users: { $elemMatch: { $eq: userID }}}
        ]
      }, { 
        $pull: { users: userID } 
      }
    );
    // .populate("users")
    // .populate("latestMessage")

    if (!isChat) {
      return next(new ErrorHandler("Something went wrong...", 404));
    }

    // isChat = await User.populate(isChat, {
    //   path: "latestMessage.sender",
    //   select: "name pic yardID"
    // })

    res.status(200).json({
      success: true,
      message: "Friend removed successfully!"
    })
  } catch (error) {
    next(error)
  }
}

const fetchChat = async (req, res, next) => {
  try {
    var allChats = await Chat.find({ 
      users: {$elemMatch: {$eq: req.user._id}}
      })
      .populate("users")
      .populate("groupAdmin")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })

    allChats = await User.populate(allChats, {
      path: 'latestMessage.sender',
      select: 'name pic yardID'
    })

    res.status(200).send(allChats);
  } catch (error) {
    next(error)
  }
}

const CreateGroupChat = async (req, res, next) => {
  if (!req.body.users || !req.body.name) {
    return next(new ErrorHandler("Fill all the fields", 400))
  }

  var users = JSON.parse(req.body.users)

  if (users.length < 2) {
    return next(new ErrorHandler("Min 3 people can be in the group", 400))
  }

  // push logged in user in the group & also set to admin.
  users.push(req.user);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });
    
    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    
    res.status(200).json(fullGroupChat);
  } catch (error) {
    next(error)
  }
}

const renameGroup = async (req, res, next) => {
    const { chatId, chatName } = req.body;
  
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { chatName: chatName },
      { new: true }
    )
      .populate("users")
      .populate("groupAdmin");
  
    if (!updatedChat) {
        return next(new ErrorHandler("Chat not found!", 404))
    } else {
      res.status(200).json(updatedChat);
    }
};

const removeFromGroup = async (req, res, next) => {
  const { chatId, userId } = req.body;

  // check if the requester is admin

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    { $pull: { users: userId } },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removed) {
    return next(new ErrorHandler("Chat not found!", 404))
  } else {
    res.status(200).json(removed);
  }
};

const addToGroup = async (req, res, next) => {
  const { chatId, userId } = req.body;

  try {
    // check if the requester is admin
    const added = await Chat.findByIdAndUpdate(
      chatId,
      { $push: { users: userId } },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
  
    if (!added) {
      return next(new ErrorHandler("Chat not found!", 404))
    } else {
      res.status(200).json(added);
    }

  } catch (error) {
    next(error.message)
  }
};


export {
    accessChat,
    removeChat,
    fetchChat,
    CreateGroupChat,
    renameGroup,
    removeFromGroup,
    addToGroup
}