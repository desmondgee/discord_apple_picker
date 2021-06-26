const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  userID: { type: String, require: true},
  serverID: { type: String, require: true},
  money: { type: Number, require: true },
  lastSync: { type: Date, default: Date.now }
});

const model = mongoose.model("profiles", profileSchema);
module.exports = model;