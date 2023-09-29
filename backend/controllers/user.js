import { ErrorHandler } from "../middleware/err.js";
import { User } from "../models/userModel.js";
import bcrypt from 'bcrypt';
import { sendCookie } from "../utils/features.js";
import cloudinary from 'cloudinary';

let ImageID = null;

const registerProfilePic = async (req, res, next) => {
  try {
    const data = req.body.data;

    // Use the uploaded file's name as the asset's public ID and 
    // allow overwriting the asset with new versions
    const options = {
      // folder: "chatyard_profile_pic",
      upload_preset: "chatyard_profile_pic",
      use_filename: true,
      unique_filename: true,
      overwrite: true,
    };

    // Upload the image
    ImageID = await cloudinary.v2.uploader.upload(
      data, 
      options);
    // return result.public_id;

    res.status(201).json({
      success: true,
      message: "image added Successfully!"
    })
  } catch (error) {
    next(error)
  }
}

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const yardID = "@" + req.body.yardID;

    let user = await User.findOne({ email });
    if (user) {
      // user already exist..
      return next(new ErrorHandler("User already exist...", 404));
    }

    let sameID = await User.findOne({ yardID });
    if (sameID) {
      return next(new ErrorHandler("YardID already exist...", 404))
    }

    // create user with hashed password.
    const hashedPassword = await bcrypt.hash(password, 10);
    
    if (ImageID) {
      user = await User.create({name, email, yardID, password: hashedPassword, pic:ImageID.secure_url});
    } else {
      user = await User.create({name, email, yardID, password: hashedPassword});
    }

    sendCookie(user, res, 201, "Registered Successfully...");
  } catch (error) {
    next(error)
  }
}


const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email }).select("+password");
    if (!user) {
      return next(new ErrorHandler("Invalid Email or password", 404))
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(new ErrorHandler("Invalid Email or password...", 404))
    }

    sendCookie(user, res, 201, "Login Successfully...");
  } catch (error) {
    next(error)
  }
}

const logout = (req, res) => {
  res
    .status(200)
    .cookie("token", "", { 
      expires: new Date(Date.now()),
      samesite: process.env.NODE_ENV == "Development" ? "lex" : "none",
      secure: process.env.NODE_ENV == "Development" ? "false" : "true"
    })
    .json({
      success: true,
      message: "Logout Successfully!!"
  })
}

const getMyProfile = (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  })
}

const getUsers = async (req, res, next) => {
  try {
    const keywords = req.query.search 
      ? (req.query.search.startsWith('@')) 
          ? { yardID: { $regex: req.query.search, $options: "i"} } 
          : { name: {$regex: req.query.search, $options: "i"} }
      : null

    let users;
    if (keywords) {
      users = await User.find(keywords).find({ _id: {$ne: req.user._id} });
    }

    res.status(200).json({users});
  } catch (error) {
    next(error)
  }
}

export {
  register,
  login,
  logout,
  getMyProfile,
  registerProfilePic,
  getUsers
}