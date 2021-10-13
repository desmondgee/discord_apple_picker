const SessionModel = require("../models/sessionSchema");
const Notice = require(__basedir + '/shared_library/notice');

module.exports = {
  name: 'reset',
  description: "Creates a reset point that excludes prior sessions from today, yesterday and week calculations",
  async execute(message, args) {
    const channel = message.channel;

    if (args.length >= 1) {
      Notice.error(channel, "This command does not take extra arguments.");
      return
    }

    const session = await SessionModel.findOne({ userID: message.author.id, finish: null, type: "work" }); 

    if (session) {
      session.finish = new Date();
      session.isResetPoint = true;
      session.save();

      Notice.success(channel, `The previous session has been closed and the current time has been set as a reset point.`);
    }
    else {
      SessionModel.create({
        userID: message.author.id, 
        type: "work",
        start: new Date(),
        finish: new Date(),
        isResetPoint: true
      });

      Notice.success(channel, `The current time has been set as a reset point.`);
    }
  }
}