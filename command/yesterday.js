const SessionModel = require("../model/sessionSchema");
const Notice = require('../library/notice');
const Analytics = require('../library/sessionAnalytics');

module.exports = {
  name: 'yesterday',
  description: "Checks how much time you spent between all sessions yesterday.",
  async execute(message) {
    const channel = message.channel;

    const startOfDay = new Date();
    startOfDay.setMilliseconds(0);
    startOfDay.setSeconds(0);
    startOfDay.setMinutes(0);
    startOfDay.setHours(-24);

    const endOfDay = new Date();
    endOfDay.setMilliseconds(9999);
    endOfDay.setSeconds(59);
    endOfDay.setMinutes(59);
    endOfDay.setHours(-1);

    const { hours, minutes } = await Analytics.dateRange(message.author.id, startOfDay, endOfDay);

    if (hours == 0 && minutes == 0) {
      Notice.error(channel, `You did not have any sessions yesterday.`);
      return
    }

    Notice.success(channel, `Yesterday's combined session time: ${hours} hours and ${minutes} minutes.`);
  }
}

