const { sendMessageToKafka } = require("../../utils/Producers");
const { failed, success } = require("../../utils/reply");
const Message = require("../Models/Message");

module.exports = class MessageController {
  static async sendMessage(req, res) {
    try {
      // const { message, senderId, receiverId } = req.body;

      // if (!message || !senderId || !receiverId) {
      //   return res
      //     .status(400)
      //     .json({ error: "Message, senderId, and receiverId are required." });
      // }

      // const messageData = {
      //   message,
      //   senderId,
      //   receiverId,
      //   timestamp: new Date(),
      // };
      const messageData = req.body;
      messageData.sender = req.user.id;

      const save = await Message.create(messageData);

      if (!save) {
        throw new Error("Failed to send message.");
      }

      // Send message to Kafka
      await sendMessageToKafka(save);

      return success(res, "Message sent successfully.", save);
    } catch (error) {
      return failed(res, error.message);
    }
  }
};
