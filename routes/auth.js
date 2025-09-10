const AuthController = require("../app/Controllers/AuthController");
const { verifyToken } = require("../app/Middleware/AuthCheck");

const router = require("express").Router();

// ? ****************************************** Login ****************************************** */
router.post("/login", AuthController.login);

// ? ****************************************** Logout ****************************************** */
router.post("/logout", verifyToken, AuthController.logout);

exports.authRouter = router;
