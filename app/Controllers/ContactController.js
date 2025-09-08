const { failed, success } = require("../../utils/reply");
const Contact = require("../Models/Contact");

module.exports = class ContactController {
  // ? ****************************************************** Create Contact ****************************************************** */
  static async create(req, res) {
    try {
      const save = await Contact.create({
        nickname: req.body.nickname || "",
        userId: req.user.id,
        contactId: req.body.contactUserId,
      });

      if (save) {
        return success(res, "Contact has been saved successfully.", save);
      }

      throw new Error("Failed to save contact.");
    } catch (error) {
      return failed(res, error.message);
    }
  }

  // ? ****************************************************** Show Contacts ****************************************************** */
  static async show(req, res) {
    try {
      const contacts = await Contact.find({ userId: req.user.id })
        .populate({
          path: "contactId",
          model: "User",
          options: { sort: { name: 1 } }, // sort by name asc
        })
        .exec();

      // Extract contactUser (like pluck in Laravel)
      const contactUsers = contacts.map((c) => c.contactId);

      // Group by first letter of name
      const groupedContacts = contactUsers.reduce((acc, user) => {
        if (!user || !user.name) return acc;

        const letter = user.name[0].toUpperCase();
        if (!acc[letter]) acc[letter] = [];
        acc[letter].push(user);

        return acc;
      }, {});

      return success(res, "Here are your contacts.", groupedContacts);
    } catch (error) {
      return failed(res, error.message);
    }
  }
};
