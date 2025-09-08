const { Router } = require("express");
const UserController = require("../app/Controllers/UserController");
const { verifyToken } = require("../app/Middleware/AuthCheck");

const router = Router();

// ? ****************************************************** Indexing of users ****************************************************** */
router.get("/", UserController.index);

// ? ****************************************************** Active users ****************************************************** */
router.get("/active", verifyToken, UserController.activeUsers);

// ? ****************************************************** Contacts ****************************************************** */
router.get("/contacts", verifyToken, UserController.contacts);

// ? ****************************************************** Contacts ****************************************************** */
router.get("/:id", verifyToken, UserController.find);

// ? ****************************************************** Create the User ****************************************************** */
router.post("/", UserController.create);

// ? ****************************************************** Bulk insert User ****************************************************** */
router.post("/bulk", UserController.store);

// ? ****************************************************** Bulk Password Update ****************************************************** */
router.patch("/bulk-password", UserController.updateAllPasswords);

// ? ****************************************************** Bulk Password Update ****************************************************** */
router.patch("/:id", UserController.update);

exports.userRouter = router;
