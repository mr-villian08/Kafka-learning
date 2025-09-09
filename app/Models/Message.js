const moment = require("moment");
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    messageType: {
      type: String,
      enum: ["text", "image", "video", "file"],
      default: "text",
    },
    status: {
      type: String,
      enum: ["sent", "delivered", "read"],
      default: "sent",
    },
  },
  { timestamps: true }
);

// Virtual for chat card time (hh:mm AM/PM)
messageSchema.virtual("createdAtFormatted").get(function () {
  return moment(this.createdAt).format("hh:mm A"); // "09:45 PM"
});

// Virtual for relative time (e.g. "Yesterday", "5 minutes ago")
messageSchema.virtual("createdAtRelative").get(function () {
  return moment(this.createdAt).fromNow();
});

// Same for updatedAt
messageSchema.virtual("updatedAtFormatted").get(function () {
  return moment(this.updatedAt).format("hh:mm A");
});

messageSchema.virtual("updatedAtRelative").get(function () {
  return moment(this.updatedAt).fromNow();
});

// Ensure virtuals show in JSON response
messageSchema.set("toJSON", { virtuals: true });
messageSchema.set("toObject", { virtuals: true });

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
