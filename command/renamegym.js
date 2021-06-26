const Notice = require('../library/notice');

module.exports = {
  name: 'renamegym',
  description: "Renames your gym.",
  async execute(message, args, _, plot) {
    const channel = message.channel;
    if (!plot) {
      Notice.error(channel, "You don't own any gyms!");
      return;
    }

    const name = args.join(" ");
    if (name.length < 3) {
      Notice.error(channel, "Pick a longer gym name!\n(at least 3 characters)");
      return;
    }

    if (name.length > 60) {
      Notice.error(channel, "Your gym name is too long!\n(no more than 60 characters)");
      return;
    }

    plot.gymName = name;
    plot.save();
    Notice.success(channel, `Your gym is now named ${plot.gymName}!`);    
  }
}