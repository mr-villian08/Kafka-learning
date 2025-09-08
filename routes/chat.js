const { Router } = require("express");
const { verifyToken } = require("../app/Middleware/AuthCheck");
const ChatController = require("../app/Controllers/ChatController");

const router = Router();

// ? ****************************************************** Show chats ****************************************************** */
router.get("/", verifyToken, ChatController.show);

// ? ****************************************************** Create Chat ****************************************************** */
router.post("/", verifyToken, ChatController.create);

exports.chatRouter = router;
