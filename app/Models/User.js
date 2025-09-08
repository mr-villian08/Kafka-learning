const { default: mongoose, Schema } = require("mongoose");
const { hashMake } = require("../../utils/AccessorsAndMutators");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      default: hashMake("Password@890"),
    },
    image: {
      type: String,
      default:
        "http://chatvia-dark.react.themesbrand.com/static/media/avatar-1.3921191a8acf79d3e907.jpg",
    },
    address: {
      street: {
        type: String,
      },
      suite: {
        type: String,
      },
      city: {
        type: String,
      },
      zipcode: {
        type: String,
      },
      geo: {
        lat: {
          type: String,
        },
        lng: {
          type: String,
        },
      },
    },
    phone: {
      type: String,
    },
    website: {
      type: String,
    },
    company: {
      name: {
        type: String,
      },
      catchPhrase: {
        type: String,
      },
      bs: {
        type: String,
      },
    },
    about: {
      type: String,
      default: "Hello! I am using ChatApp.",
    },
    status: {
      type: String,
      enum: ["online", "offline"],
    },
    lastSeenAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true, toObject: { virtuals: true }, toJSON: { virtuals: true } }
);

// userSchema.index({ email: 1 });
userSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    hashMake(this.password);
  }
  next();
});

// ? *********************************************** Virtuals *********************************************** */
userSchema.virtual("contacts", {
  ref: "Contact",
  localField: "_id",
  foreignField: "userId",
});

module.exports = mongoose.model("User", userSchema);
