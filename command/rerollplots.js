const PlotModel = require("../model/plotSchema");
const Notice = require('../library/notice');

module.exports = {
  name: 'rerollplots',
  description: "admin/developer function. rerolls current plots.",
  async execute(message) {
    await PlotModel.deleteMany({userID: { $exists: false }}).exec();
    Notice.success(message.channel, "Plots have been re-rolled")
  }
}