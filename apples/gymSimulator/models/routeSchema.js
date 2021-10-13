const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
  plotId: { type: mongoose.ObjectId, require: true},
  letter: { type: String, require: true },
  grade: { type: Number, require: true }
});

const model = mongoose.model("cgs__routes", routeSchema);
module.exports = model;