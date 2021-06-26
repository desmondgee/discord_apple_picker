const mongoose = require('mongoose');

const climberSchema = new mongoose.Schema({
  userID: { type: String, require: true},
  serverID: { type: String, require: true},
  plotID: { type: mongoose.ObjectId, require: true},
  visitTime: { type: Date, require: true },
  leaveTime: { type: Date, require: true }
});

const model = mongoose.model("climbers", climberSchema);
module.exports = model;