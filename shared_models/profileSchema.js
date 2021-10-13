const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  // userID: { type: String, require: true },
  userId: { type: String, require: true },
  guildId: { type: String, require: true },
  // serverID: { type: String, require: true },
  // money: { type: Number, require: true },
  apple: { type: String, require: true }
  // lastSync: { type: Date, default: Date.now }
});

const model = mongoose.model("profiles", profileSchema);
module.exports = model;