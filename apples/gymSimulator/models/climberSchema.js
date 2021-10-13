const mongoose = require('mongoose');

const climberSchema = new mongoose.Schema({
  userId: { type: mongoose.ObjectId, require: true},
  plotId: { type: mongoose.ObjectId, require: true},
  guildId: { type: String, require: true},
  visitTime: { type: Date, require: true },
  leaveTime: { type: Date, require: true }
});

const model = mongoose.model("cgs__climbers", climberSchema);
module.exports = model;