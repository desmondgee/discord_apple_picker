const PlotModel = require("../models/plotSchema");
const Notice = require(__basedir + '/shared_library/notice');
const Format = require(__basedir + '/shared_library/format');

module.exports = {
  name: 'buyplot',
  description: "allows you to buy a plot listed with the `.plots` command. Command must be followed by the letter of the plot you want to purchase.",
  async execute(message, args, user, oldPlot) {
    const channel = message.channel;
    if (oldPlot) {
      Notice.error(channel, "You can't purchase a new plot because you already own a gym. Sell your current gym with the `.sellgym` command before buying a new one.");
      return;
    }

    if (args.length == 0) {
      Notice.error(channel, "You need to specify the letter of the plot you want to purchase.\nExample: `.buyplot A`");
      return
    }

    const letter = args[0].toUpperCase();
    const newPlot = await PlotModel.findOne({ userId: null, guildId: message.guild.id, letter: letter });

    if (!newPlot) {
      Notice.error(channel, "Could not find Plot " + letter + ".\nUse the `.plots` command to see available plots for purchase.");
      return
    }

    if (newPlot.cost > user.money) {
      const difference = newPlot.cost - user.money;
      Notice.error(channel, "You cannot afford this plot! Maybe get a job instead of working on discord bots all day!\n(You are short by " + Format.dollars(difference) + ".)");
      return
    }

    user.money = user.money - newPlot.cost;
    user.lastSync = Date.now();
    newPlot.dayPass = 20;
    newPlot.gymName = "Unnamed Gym";
    newPlot.userId = user._id;

    user.save();
    newPlot.save();

    Notice.success(channel, "Congrats! You are now the owner of a brand new gym.\nRemember to use `.renamegym` to give your gym a name!");
  }
}