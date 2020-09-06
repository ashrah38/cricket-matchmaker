const mongoose = require("mongoose");
const timingsSchema = new mongoose.Schema({
  id: {
    type: Number,
  },
  people: {
    type: Array,
    default: [],
  },
});

const time = mongoose.model("timing", timingsSchema);
module.exports = time;
