const PlotModel = require("../model/plotSchema");
const Notice = require('../library/notice');
const Format = require('../library/format');

const errorText = "Enter a dollar value after the command. Examples:\n`!daypass $51`\n`!daypass 33`";

module.exports = {
  name: 'daypass',
  description: "Sets the daypass price for your gym.",
  async execute(message, args, profile) {
    const channel = message.channel;
    const plot = await PlotModel.findOne({ userID: message.author.id, serverID: message.guild.id });
    if (!plot) {
      Notice.error(channel, "You don't own any gyms!");
      return;
    }

    if (args.length < 1) {
      Notice.error(channel, errorText);
      return;
    }

    const matches = args[0].match(/\d+/);
    if (matches === null) {
      Notice.error(channel, errorText);
      return;
    }

    const value = parseInt(matches[0]);
    if (value === NaN) {
      Notice.error(channel, errorText);
      return;
    }

    plot.dayPass = value;
    plot.save();
    Notice.success(channel, `Your day passes are now priced at ${Format.dollars(plot.dayPass)}!`);    
  }
}