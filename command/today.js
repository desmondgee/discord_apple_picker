const SessionModel = require("../model/sessionSchema");
const Notice = require('../library/notice');
const Analytics = require('../library/sessionAnalytics');

module.exports = {
  name: 'today',
  description: "Checks how much time you spent between all sessions today.",
  async execute(message) {
    const channel = message.channel;

    const startOfDay = new Date();
    startOfDay.setMilliseconds(0);
    startOfDay.setSeconds(0);
    startOfDay.setMinutes(0);
    startOfDay.setHours(0);

    const { hours, minutes } = await Analytics.dateRange(message.author.id, startOfDay, new Date());

    if (hours == 0 && minutes == 0) {
      Notice.error(channel, `You did not have any sessions today.`);
      return
    }

    Notice.success(channel, `Today's combined session time: ${hours} hours and ${minutes} minutes.`);
  }
}

