const Notice = require('../library/notice');
const Format = require('../library/format');

const errorText = "Enter a dollar value after the command. Examples:\n`!addfunds $51`\n`!addfunds 33`";

module.exports = {
  name: 'addfunds',
  description: "Cheat to add funds.",
  async execute(message, args, profile) {
    const channel = message.channel;
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

    profile.money = profile.money + value;
    profile.save();
    Notice.success(channel, `You've very dangerously taken out a loan from Yin worth ${Format.dollars(value)}!`);
  }
}