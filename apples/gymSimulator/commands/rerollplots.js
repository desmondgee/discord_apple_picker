const PlotModel = require("../models/plotSchema");
const Notice = require(__basedir + '/shared_library/notice');

module.exports = {
  name: 'rerollplots',
  description: "admin/developer function. rerolls current plots.",
  async execute(message) {
    await PlotModel.deleteMany({userId: { $exists: false }}).exec();
    Notice.success(message.channel, "Plots have been re-rolled")
  }
}