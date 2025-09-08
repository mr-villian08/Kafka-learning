const { Router } = require("express");
const { verifyToken } = require("../app/Middleware/AuthCheck");
const MessageController = require("../app/Controllers/MessageController");

const router = Router();

// ? ****************************************************** Send Messages ****************************************************** */
router.post("/", verifyToken, MessageController.sendMessage);

exports.messageRouter = router;
