const { Schema, model  } = require("mongoose")

const User = Schema({
  key: String,
  username: String,
  logined: { type: Number, default: 0 },
  hwidRequired: Boolean,
  keys: Array,
  hwid: { type: String },
  startdate: { type: Date, default: Date.now },
  endDate: Date,
});

module.exports = model("User", User)