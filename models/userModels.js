const mongoose = require("mongoose");

const userScehma = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "please add first Name"],
    },
    lastName: {
      type: String,
      required: [true, "please add last Name"],
    },
    phoneNumber: {
      type: Number,
      required: [true, "please add phone number"],
    },
    email: {
      type: String,
      required: [true, "please add valid email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "please add password"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("usersCollection", userScehma);
