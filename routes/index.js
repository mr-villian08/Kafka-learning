const { Router } = require("express");
const ApiCheck = require("../app/Middleware/ApiKeyCheck");

const router = Router();

// ? ****************************************************** Auth ****************************************************** */
router.use("/auth", ApiCheck, require("./auth").authRouter);

// ? ****************************************************** Users ****************************************************** */
router.use("/users", ApiCheck, require("./user").userRouter);

// ? ****************************************************** Messages ****************************************************** */
router.use("/messages", ApiCheck, require("./message").messageRouter);

// ? ****************************************************** Chats ****************************************************** */
router.use("/chats", ApiCheck, require("./chat").chatRouter);

// ? ****************************************************** Contacts ****************************************************** */
router.use("/contacts", ApiCheck, require("./contact").contactRouter);

exports.routes = router;
