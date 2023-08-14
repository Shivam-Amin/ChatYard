import { Router } from "express";
import { getMyProfile, login, logout, register, registerProfilePic } from "../controllers/user.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = Router();

router.post('/newUser', register);
router.post('/newUser/profilePic/upload', registerProfilePic);
router.post('/login', login);
router.get('/me', isAuthenticated, getMyProfile);
router.get('/logout', isAuthenticated, logout);



export default router;