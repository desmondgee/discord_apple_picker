const mongoose = require('mongoose');

// The ApplePicker's Profile Model keeps references to Discord's user and guild id
// The Gym Simulator's User Model stores references to ApplePicker's Profile id
// Gym Simulator commands all reference Gym Simulator's own User only.
const userSchema = new mongoose.Schema({
  profileId: { type: mongoose.ObjectId, require: true},
  money: { type: Number, require: true },
  lastSync: { type: Date, default: Date.now }
});

const model = mongoose.model("cgs__users", userSchema);
module.exports = model;