const PlotModel = require("../models/plotSchema");
const Notice = require(__basedir + '/shared_library/notice');
const Format = require(__basedir + '/shared_library/format');

module.exports = {
  name: 'sellgym',
  description: "Sells your gym.",
  async execute(message, _args, user, plot) {
    const channel = message.channel;
    if (!plot) {
      Notice.error(channel, "You don't own any gym to sell!");
      return;
    }

    const sale = Math.round(plot.cost * 0.8);
    user.money = user.money + sale;

    if (user.money < 200000) {
      user.money = 200000;
      user.save();
      plot.remove();
      Notice.success(channel, "You sold your gym for " + Format.dollars(sale) + ".");
      Notice.success(channel, "A benefactor has contributed funds toward your next gym.\nYou now have $200,000 available.");
      return;
    }

    user.save();
    plot.remove();
    Notice.success(channel, "You sold your gym for " + Format.dollars(sale) + ".");    
  }
}