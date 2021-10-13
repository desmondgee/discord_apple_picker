const mongoose = require('mongoose');

const worldSchema = new mongoose.Schema({
  serverID: { type: String, require: true}
});

const model = mongoose.model("worlds", worldSchema);
module.exports = model;