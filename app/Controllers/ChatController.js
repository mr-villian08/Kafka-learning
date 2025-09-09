const { default: mongoose } = require("mongoose");
const { failed, success } = require("../../utils/reply");
const Chat = require("../Models/Chat");
const Message = require("../Models/Message");
const User = require("../Models/User");

module.exports = class ChatController {
  // ? ****************************************** Create or fetch chat ****************************************** */
  static async create(req, res) {
    try {
      const contactId = req.body.contact_user_id;
      const authUserId = req.user.id; // Set by your auth middleware

      //   let chat = await Chat.aggregate([
      //     {
      //       $match: {
      //         isGroup: false,
      //         participants: {
      //           $all: [req.user.id, mongoose.Types.ObjectId(contactId)],
      //         },
      //       },
      //     },
      //   ]);

      //   if (chat.length === 0) {
      //     chat = await Chat.create({ participants: [req.user.id, contactId] });
      //   }

      // Find existing chat
      let chatRoom = await Chat.findOne({
        isGroup: false,
        participants: { $all: [authUserId, contactId], $size: 2 },
      });

      // If not found, create new chat
      if (!chatRoom) {
        chatRoom = await Chat.create({
          isGroup: false,
          created_by: authUserId,
          participants: [authUserId, contactId],
        });
      }

      // Get messages for this chat
      const messages = await Message.find({ chatId: chatRoom._id })
        // .sort({ createdAt: -1 })
        .populate("sender", "name username image")
        .populate("receiver", "name username image");

      // Mark is_sender for each message
      const messagesWithSenderFlag =
        messages.length > 0
          ? messages.map((msg) => ({
              ...msg.toObject(),
              isSender: msg.sender._id.toString() === authUserId,
            }))
          : [];

      // Get the other participant
      const participantId = chatRoom.participants.find(
        (id) => id.toString() !== authUserId
      );
      const participant = await User.findById(participantId);

      //   return res.json({
      //     message: "Here is the chat.",
      //     data: {
      //       chatRoom,
      //       messages: messagesWithSenderFlag,
      //       participant,
      //     },
      //   });

      return success(res, "Here is the chat.", {
        chatRoom,
        messages: messagesWithSenderFlag,
        participant,
      });
    } catch (error) {
      return failed(res, error.message);
    }
  }

  // ? ****************************************** Show all chats for auth user ****************************************** */
  static async show(req, res) {
    try {
      const authUserId = req.user.id; // Set by your auth middleware

      // Find all chats where the user is a participant
      let chats = await Chat.find({ participants: authUserId })
        // .populate("participants", "name username email")
        .populate("participants", "name username image")
        .lean();

      // For each chat, get messages and the other participant
      const chatData = await Promise.all(
        chats.map(async (chat) => {
          const messages = await Message.find({ chatId: chat._id })
            .sort({ createdAt: -1 })
            .populate("sender", "name username image")
            .populate("receiver", "name username image");

          const participant = chat.participants.find(
            (p) => p._id.toString() !== authUserId
          );

          return {
            ...chat,
            messages,
            participant,
            lastMessage: messages[0] || null,
          };
        })
      );

      return success(res, "Here are your chats.", chatData);
    } catch (err) {
      return failed(res, err.message);
    }
  }
};
