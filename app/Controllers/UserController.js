const AccessorsAndMutators = require("../../utils/AccessorsAndMutators");
const { failed, success } = require("../../utils/reply");
const User = require("../Models/User");

module.exports = class UserController {
  // ? *********************************************** Get all Users *********************************************** */
  static async index(req, res) {
    try {
      const users = await User.find();

      return success(res, "Here are all the users.", users);
    } catch (error) {
      return failed(res, error.message);
    }
  }

  // ? *********************************************** Get active Users *********************************************** */
  static async activeUsers(req, res) {
    try {
      const activeUsers = await User.find({
        // status: "ONLINE",
        _id: { $ne: req.user.id }, // Exclude self if needed
      });

      return success(res, "Here are the active users.", activeUsers);
    } catch (error) {
      return failed(res, error.message);
    }
  }

  // ? *********************************************** Users as contacts *********************************************** */
  static async contacts(req, res) {
    try {
      const authUserId = req.user.id; // Set by your auth middleware

      // Find all users except the current user, ordered by name
      const contacts = await User.find({ _id: { $ne: authUserId } })
        .sort({ name: 1 })
        .lean();

      // Group contacts by first letter of name (uppercase)
      const groupedContacts = contacts.reduce((groups, contact) => {
        const firstLetter = contact.name[0].toUpperCase();
        if (!groups[firstLetter]) {
          groups[firstLetter] = [];
        }
        groups[firstLetter].push(contact);
        return groups;
      }, {});

      return success(res, "Here are your contacts.", groupedContacts);
    } catch (error) {
      return failed(res, error.message);
    }
  }

  // ? *********************************************** Single User *********************************************** */
  static async find(req, res) {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        throw new Error("User not found.");
      }

      return success(res, "Here is the user.", user);
    } catch (error) {
      return failed(res, error.message);
    }
  }

  // ? *********************************************** Create a new User *********************************************** */
  static async create(req, res) {
    try {
      const newUser = new User(req.body);
      const savedUser = await newUser.save();
      res.status(201).json(savedUser);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // ? *********************************************** Update User *********************************************** */
  static async update(req, res) {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

      if (!updatedUser) {
        throw new Error("User not found.");
      }

      return success(res, "User updated successfully.", updatedUser);
    } catch (error) {
      return failed(res, error.message);
    }
  }

  // ? *********************************************** Create many Users *********************************************** */
  static async store(req, res) {
    try {
      const savedUser = await User.insertMany(req.body);
      res.status(201).json(savedUser);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // ? *********************************************** Update all User Passwords *********************************************** */
  static async updateAllPasswords(req, res) {
    try {
      const updated = await User.updateMany(
        {},
        { password: AccessorsAndMutators.hashMake("Newone@890") }
      );
      res.status(200).json({
        message: "Passwords updated for all users",
        modifiedCount: updated.modifiedCount,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};
