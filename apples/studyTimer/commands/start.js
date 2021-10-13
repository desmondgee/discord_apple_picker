const SessionModel = require("../models/sessionSchema");
const Notice = require(__basedir + '/shared_library/notice');

module.exports = {
  name: 'start',
  description: "Starts a session. `start SESSION_TYPE` Optionally include a type if you don't want to use the default.",
  async execute(message, args) {
    const channel = message.channel;

    if (args.length >= 1) {
      Notice.error(channel, "Session types aren't supported yet.");
      return
    }

    session = await SessionModel.findOne({ userID: message.author.id, finish: null, type: "work" }); 

    if (session) {
      Notice.error(channel, `You have an active session started on ${ session.start }.`);
      return
    }

    SessionModel.create({ userID: message.author.id, type: "work" });
    Notice.success(channel, "Session started!");
  }
}