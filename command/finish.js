const SessionModel = require("../model/sessionSchema");
const Notice = require('../library/notice');

module.exports = {
  name: 'finish',
  description: "Finishes a session. `finish SESSION_TYPE` Optionally include a type if you don't want to use the default.",
  async execute(message, args, profile) {
    const channel = message.channel;

    if (args.length >= 1) {
      Notice.error(channel, "Session types aren't supported yet.");
      return
    }

    const session = await SessionModel.findOne({ userID: message.author.id, finish: null, type: "work" }); 

    if (!session) {
      Notice.error(channel, `You don't have an active session to finish.`);
      return
    }

    session.finish = new Date();
    session.save();

    const totalMinutes = Math.floor((session.finish - session.start) / (1000 * 60))
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.floor(totalMinutes % 60);
    Notice.success(channel, `Session finished in ${hours} hours and ${minutes} minutes.`);
  }
}