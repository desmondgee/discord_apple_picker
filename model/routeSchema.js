const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
  plotID: { type: String, require: true},
  letter: { type: String, require: true },
  grade: { type: Number, require: true }
});

const model = mongoose.model("RouteModel", routeSchema);
module.exports = model;