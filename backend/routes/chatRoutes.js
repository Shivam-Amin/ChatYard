import { Router } from "express";
import { isAuthenticated } from "../middleware/auth.js";
import { CreateGroupChat, accessChat, addToGroup, fetchChat, removeFromGroup, renameGroup } from "../controllers/chat.js";

const router = Router();

router.route('/')
    .post(isAuthenticated, accessChat)
    .get(isAuthenticated, fetchChat)
router.route("/createGroup").post(isAuthenticated, CreateGroupChat);
router.route("/renameGroup").put(isAuthenticated, renameGroup);
router.route("/removeFromGroup").put(isAuthenticated, removeFromGroup);
router.route("/AddToGroup").put(isAuthenticated, addToGroup);
    

export default router;