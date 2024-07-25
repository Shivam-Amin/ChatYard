import { Router } from "express";
import { isAuthenticated } from "../middleware/auth.js";
import { getAllMessages, sendMessage } from "../controllers/message.js";

const router = Router();

router.route('/').post(isAuthenticated, sendMessage);
router.route('/:chatId').get(isAuthenticated, getAllMessages);

export default router;