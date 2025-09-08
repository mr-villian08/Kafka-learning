const { body } = require("express-validator");
const User = require("../Models/User");

exports.contactValidations = [
  body("emailPhoneUsername")
    .notEmpty()
    .withMessage("Enter the email, phone number or username!")
    .bail() // stop running validations if empty
    .custom(async (value, { req }) => {
      let field;

      // Determine field type
      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        field = "email";
      } else if (/^\+?[0-9]{10,15}$/.test(value)) {
        field = "phone_number";
      } else if (/^[a-zA-Z0-9_]+$/.test(value)) {
        field = "username";
      } else {
        throw new Error("Invalid email, phone number, or username format!");
      }

      // Attach field type to request
      req.body.field = field;

      // Check if user exists (excluding self)
      const user = await User.findOne({
        [field]: value,
        _id: { $ne: req.user.id },
      });

      if (!user) {
        throw new Error(
          "Contact user does not exist. Enter email to send invite."
        );
      }

      // Attach found user to request for controller use
      req.body.contactUserId = user._id;

      return true;
    }),

  body("nickname")
    .optional()
    .isString()
    .withMessage("Nickname must be a string"),
];
