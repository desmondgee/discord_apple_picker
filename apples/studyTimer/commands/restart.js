const SessionModel = require("../models/sessionSchema");
const Notice = require(__basedir + '/shared_library/notice');

module.exports = {
  name: 'restart',
  description: "Stops current session and begins a new one.",
  async execute(message, args) {
    const channel = message.channel;

    if (args.length >= 1) {
      Notice.error(channel, "Session types aren't supported yet.");
      return
    }

    const session = await SessionModel.findOne({ userID: message.author.id, finish: null, type: "work" }); 

    if (!session) {
      SessionModel.create({ userID: message.author.id, type: "work" });
      Notice.success(channel, `No active session so started a new one.`);
      return
    }

    session.finish = new Date();
    session.save();
    SessionModel.create({ userID: message.author.id, type: "work" });

    const totalMinutes = Math.floor((session.finish - session.start) / (1000 * 60))
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.floor(totalMinutes % 60);
    Notice.success(channel, `Starting a new session! Previous active session finished at ${hours} hours and ${minutes} minutes.`);
  }
}