const PlotModel = require("../model/plotSchema");
const Notice = require('../library/notice');
const Format = require('../library/format');

module.exports = {
  name: 'buyplot',
  description: "allows you to buy a plot listed with the `!plots` command. Command must be followed by the letter of the plot you want to purchase.",
  async execute(message, args, profile) {
    const channel = message.channel;
    const existingPlot = await PlotModel.findOne({ userID: message.author.id, serverID: message.guild.id });
    if (existingPlot) {
      Notice.error(channel, "You can't purchase a new plot because you already own a gym. Sell your current gym with the `!sellgym` command before buying a new one.");
      return;
    }

    if (args.length == 0) {
      Notice.error(channel, "You need to specify the letter of the plot you want to purchase.\nExample: `!buyplot A`");
      return
    }

    const letter = args[0].toUpperCase();
    const plot = await PlotModel.findOne({ userID: null, serverID: message.guild.id, letter: letter });

    if (!plot) {
      Notice.error(channel, "Could not find Plot " + letter + ".\nUse the `!plots` command to see available plots for purchase.");
      return
    }

    if (plot.cost > profile.money) {
      const difference = plot.cost - profile.money;
      Notice.error(channel, "You cannot afford this plot! Maybe get a job instead of working on discord bots all day!\n(You are short by " + Format.dollars(difference) + ".)");
      return
    }

    profile.money = profile.money - plot.cost;
    profile.lastSync = Date.now();
    plot.dayPass = 20;
    plot.gymName = "Unnamed Gym";
    plot.userID = profile.userID;

    profile.save();
    plot.save();

    Notice.success(channel, "Congrats! You are now the owner of a brand new gym.\nRemember to use `!renamegym` to give your gym a name!");
  }
}