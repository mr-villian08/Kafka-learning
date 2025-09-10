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

      // Find user by email or username
      const user = await User.findOne({
        $or: [{ email: usernameOrEmail }, { username: usernameOrEmail }],
      });

      if (!user) {
        return failed(res, "User not found. Try again!", 404);
      }

      // Compare password
      const isMatch = compareHash(password, user.password);
      if (!isMatch) {
        return failed(res, "Password is incorrect. Try again!", 401);
      }

      // Update status
      user.status = "online";
      await user.save();

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

  // ? ****************************************** Logout ****************************************** */
  static async logout(req, res) {
    try {
      const user = await User.findById(req.user.id);

      if (!user) {
        return failed(res, "User not found. Try again!", 404);
      }
      user.status = "offline";
      user.lastSeenAt = new Date();
      await user.save();
      return success(res, "Logout successful");
    } catch (error) {
      return failed(res, error.message);
    }
  }
};
