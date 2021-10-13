const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  userID: { type: String, require: true},
  type: { type: String, require: true},
  start: { type: Date, default: Date.now },
  finish: { type: Date, default: null },
  extraSeconds: { type: Number, default: 0 },
  isResetPoint: { type: Boolean, default: false }
});

const model = mongoose.model("stt__sessions", sessionSchema);
module.exports = model;