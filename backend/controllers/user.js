import { ErrorHandler } from "../middleware/err.js";
import { User } from "../models/userModel.js";
import bcrypt from 'bcrypt';
import { sendCookie } from "../utils/features.js";

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      // user already exist..
      return next(new ErrorHandler("User already exist...", 404));
    }

    // create user with hashed password.
    const hashedPassword = await bcrypt.hash(password, 10);
    user = await User.create({name, email, password: hashedPassword});

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

    console.log('req has come');

    sendCookie(user, res, 201, "Login Successfully...");
  } catch (error) {
    next(error)
  }
}

const logout = (req, res) => {
  res
    .status(200)
    .cookie("token", "", { expires: new Date(Date.now()) })
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

export {
    register,
    login,
    logout,
    getMyProfile
}