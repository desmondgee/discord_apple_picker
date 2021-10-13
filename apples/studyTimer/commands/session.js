const SessionModel = require("../models/sessionSchema");
const Notice = require(__basedir + '/shared_library/notice');

module.exports = {
  name: 'session',
  description: "Shows the elapsed duration of the current session.",
  async execute(message) {
    const channel = message.channel;

    const session = await SessionModel.findOne({ userID: message.author.id, finish: null, type: "work" }); 

    if (!session) {
      Notice.error(channel, `You don't have an active session to session.`);
      return
    }

    session.finish = new Date();

    const totalMinutes = Math.floor((session.finish - session.start) / (1000 * 60)) + Math.floor(session.extraSeconds / 60)
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.floor(totalMinutes % 60);
    Notice.success(channel, `Current session has been active for ${hours} hours and ${minutes} minutes.`);
  }
}
