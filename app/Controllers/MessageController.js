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

      const save = await Message.populate(await Message.create(messageData), [
        { path: "sender", select: "name username image" },
        { path: "receiver", select: "name username image" },
      ]);

      if (!save) {
        throw new Error("Failed to send message.");
      }

      const sentMessage = {
        ...save._doc,
        isSender: save._doc.sender._id.toString() === req.user.id,
      };

      // Send message to Kafka
      await sendMessageToKafka({
        ...save._doc,
        isSender: false,
      });

      return success(res, "Message sent successfully.", sentMessage);
    } catch (error) {
      return failed(res, error.message);
    }
  }
};
