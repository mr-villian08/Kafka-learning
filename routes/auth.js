const router = require("express").Router();

// ? ****************************************** Login ****************************************** */
router.post("/login", require("../app/Controllers/AuthController").login);

exports.authRouter = router;
