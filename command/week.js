const SessionModel = require("../model/sessionSchema");
const Notice = require('../library/notice');
const Analytics = require('../library/sessionAnalytics');

module.exports = {
  name: 'week',
  description: "Checks how much time you spent between all sessions week.",
  async execute(message) {
    const channel = message.channel;

    const start = new Date();
    start.setMilliseconds(0);
    start.setSeconds(0);
    start.setMinutes(0);
    start.setHours(-24*6);

    const { hours, minutes } = await Analytics.dateRange(message.author.id, start, new Date());

    if (hours == 0 && minutes == 0) {
      Notice.error(channel, `You did not have any sessions over last 7 days.`);
      return
    }

    Notice.success(channel, `Last 7 days combined session time: ${hours} hours and ${minutes} minutes.`);
  }
}

