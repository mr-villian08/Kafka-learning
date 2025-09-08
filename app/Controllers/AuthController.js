const AccessorsAndMutators = require("../../utils/AccessorsAndMutators");
const { compareHash } = require("../../utils/AccessorsAndMutators");
const { failed, success } = require("../../utils/reply");
const Token = require("../../utils/Token");
const User = require("../Models/User");

module.exports = class AuthController {
  // ? ****************************************** Register ****************************************** */
  static async register(req, res) {
    try {
      req.body.password = AccessorsAndMutators.hashMake(req.body.password);
      // req.body.name =
    } catch (error) {}
  }

  // ? ****************************************** Login ****************************************** */
  static async login(req, res) {
    try {
      const { usernameOrEmail, password } = req.body;
      const email = usernameOrEmail;

      const user = await User.findOne({ email });

      if (!user) {
        throw new Error("Email does not exist. Try again!");
      }

      if (!compareHash(password, user.password)) {
        throw new Error("Password is incorrect. Try again!");
      }

      const data = {
        id: user._id,
        name: user.name,
        email: user.email,
      };

      const token = Token.createToken(data);

      return success(res, "Login successful", { user: data, token });
    } catch (error) {
      return failed(res, error.message);
    }
  }
};
