const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    admin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Passport-Local-Mongoose sẽ tự động thêm username, hash, salt fields
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
