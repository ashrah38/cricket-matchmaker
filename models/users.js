const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const moment = require("moment");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
  },
  username: {
    type: String,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  password: {
    type: String,
  },
  createdAt: {
    type: String,
    default: Date.now(),
  },
  monthAt: {
    type: String,
    default: moment().format("MMMM"),
  },
  yearAt: {
    type: String,
    default: moment().format("YYYY"),
  },
  availability: {
    type: Array,
    default: [],
  },
  friends: {
    type: Array,
    default: [],
  },
  schedule: {
    type: Array,
    default: [],
  },
});

userSchema.plugin(passportLocalMongoose);

const user = mongoose.model("user", userSchema);
module.exports = user;
