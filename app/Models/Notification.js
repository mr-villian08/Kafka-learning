const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // who will receive this notification
      required: true,
    },
    type: {
      type: String,
      enum: ["message", "friend_request", "system"],
      required: true,
    },
    message: {
      type: String,
      trim: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    metadata: {
      type: Object, // flexible: can store messageId, chatId, etc.
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
