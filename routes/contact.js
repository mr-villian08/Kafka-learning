const ContactController = require("../app/Controllers/ContactController");
const { verifyToken } = require("../app/Middleware/AuthCheck");
const ErrorsCheck = require("../app/Middleware/ErrorsCheck");
const { contactValidations } = require("../app/Middleware/Validations");

const router = require("express").Router();

// ? ****************************************************** Create Contact ****************************************************** */
router.post(
  "/",
  verifyToken,
  contactValidations,
  ErrorsCheck,
  ContactController.create
);

// ? ****************************************************** Show contacts ****************************************************** */
router.get("/", verifyToken, ContactController.show);

exports.contactRouter = router;
