const { validationResult } = require("express-validator");
const { failed } = require("../../utils/reply");

const ErrorsCheck = (req, res, next) => {
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      throw new Error(errors.array()[0].msg);
    }
    return next();
  } catch (error) {
    return failed(res, error.message);
  }
};

module.exports = ErrorsCheck;
