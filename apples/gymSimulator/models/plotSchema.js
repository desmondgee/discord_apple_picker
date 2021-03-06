const mongoose = require('mongoose');

const plotSchema = new mongoose.Schema(
  {
    guildId: { type: String, require: true},
    userId: { type: mongoose.ObjectId },
    letter: { type: String, require: true },
    cost: { type: Number, require: true },
    tax: { type: Number, require: true },
    maxRoutes: { type: Number, require: true },
    areaPopulation: { type: Number, require: true },
    areaWealth: { type: Number, require: true },
    areaVLevel: { type: Number, require: true },
    gymName: { type: String },
    dayPass: { type: Number },
    todayIncome: { type: Number, default: 0 },
    yesterdayIncome: { type: Number, default: 0 },
    occupancy: { type: Number, default: 0 },
    todayVisits: { type: Number, default: 0 },
    yesterdayVisits: { type: Number, default: 0 }
  },
  { timestamps: true }
);

const model = mongoose.model("cgs__plots", plotSchema);
module.exports = model;