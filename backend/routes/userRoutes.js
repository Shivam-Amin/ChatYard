import { Router } from "express";
import { getMyProfile, login, logout, register, registerProfilePic, getUsers } from "../controllers/user.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = Router();

router.get('/', isAuthenticated, getUsers);
router.post('/register', register);
router.post('/register/profilePic/upload', registerProfilePic);
router.post('/login', login);
router.get('/me', isAuthenticated, getMyProfile);
router.get('/logout', isAuthenticated, logout);



export default router;