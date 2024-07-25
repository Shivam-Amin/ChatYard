import jwt from "jsonwebtoken";

export const sendCookie = (user, res, statusCode=500, message='Internal server error') => {
  const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET);

  return res
    .status(statusCode)
    .cookie("token", token, {
      httpOnly: true, 
      maxAge:7*24*60*60*1000,
      samesite: process.env.NODE_ENV == "Development" ? "lex" : "none",
      secure: process.env.NODE_ENV == "Development" ? "false" : "true"
    }).json({
      success: true,
      message
    })
}