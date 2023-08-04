import { Router } from "express";
import { getMyProfile, login, logout, register } from "../controllers/user.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = Router();

router.post('/newUser', register);
router.post('/login', login);
router.get('/me', isAuthenticated, getMyProfile);
router.get('/logout', isAuthenticated, logout);


export default router;