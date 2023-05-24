const { Schema, model  } = require("mongoose")

const User = Schema({
  key: String,
  username: String,
  startdate: { type: Date, default: Date.now },
  endDate: Date,
  logined: { type: Number, default: 0 }
});

module.exports = model("User", User)