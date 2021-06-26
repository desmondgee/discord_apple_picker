const PlotModel = require("../model/plotSchema");
const Notice = require('../library/notice');
const Format = require('../library/format');

module.exports = {
  name: 'sellgym',
  description: "Sells your gym.",
  async execute(message, args, profile) {
    const channel = message.channel;
    const plot = await PlotModel.findOne({ userID: message.author.id, serverID: message.guild.id });
    if (!plot) {
      Notice.error(channel, "You don't own any gym to sell!");
      return;
    }

    const sale = Math.round(plot.cost * 0.8);
    profile.money = profile.money + sale;

    if (profile.money < 200000) {
      profile.money = 200000;
      profile.save();
      plot.remove();
      Notice.success(channel, "You sold your gym for " + Format.dollars(sale) + ".");
      Notice.success(channel, "A benefactor has contributed funds toward your next gym.\nYou now have $200,000 available.");
      return;
    }

    profile.save();
    plot.remove();
    Notice.success(channel, "You sold your gym for " + Format.dollars(sale) + ".");    
  }
}