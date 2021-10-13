const SessionModel = require("../models/sessionSchema");
const Notice = require(__basedir + '/shared_library/notice');

const minuteTerms = [
  "m",
  "min",
  "minute",
  "minutes"
];

const hourTerms = [
  "h",
  "hr",
  "hrs",
  "hour",
  "hours"
];

module.exports = {
  name: 'add',
  description: "Include either 'NUMBER hours' or 'NUMBER minutes' after command. Adds time from the current session. If one doesn't exist, it creates and finishes a session that adds time.",
  async execute(message, args) {
    const channel = message.channel;

    if (args.length < 2) {
      Notice.error(channel, "Requires hours or minutes. Examples: `add 30 minutes` or `add 3 hours`");
      return
    }

    let number = parseInt(args[0]);
    if (number === NaN) {
      Notice.error(channel, "Requires second term to be a number. Examples: `add 30 minutes` or `add 3 hours`");
      return
    }

    let extraSeconds = 0;
    if (minuteTerms.includes(args[1])) {
      extraSeconds += number * 60;
    }
    else if (hourTerms.includes(args[1])) {
      extraSeconds += number * 60 * 60;
    }
    else {
      Notice.error(channel, "Requires third term to be either `minutes` or `hours`. Examples: `add 30 minutes` or `add 3 hours`");
      return
    }

    session = await SessionModel.findOne({ userID: message.author.id, finish: null, type: "work" }); 

    if (session) {
      session.extraSeconds += extraSeconds;
      session.save();

      Notice.success(channel, `You added ${extraSeconds} seconds to the current session. Current session now has ${session.extraSeconds} total extra seconds.`);
      return;
    }
    
    SessionModel.create({ userID: message.author.id, type: "work", start: new Date(), finish: new Date(), extraSeconds: extraSeconds });
    Notice.success(channel, `You added ${extraSeconds} seconds to today's sesson time`);
  }
}