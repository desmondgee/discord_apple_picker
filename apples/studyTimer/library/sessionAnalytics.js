const SessionModel = require("../models/sessionSchema");
const Notice = require(__basedir + '/shared_library/notice');

module.exports = {
  async dateRange(userID, analyticsStart, analyticsEnd) {
    const sessions1 = await SessionModel.find({ userID: userID, start: {$gte: analyticsStart, $lt: analyticsEnd}, type: "work" }); 
    const sessions2 = await SessionModel.find({ userID: userID, finish: {$gt: analyticsStart, $lte: analyticsEnd}, type: "work" }); 
    const currentSession = await SessionModel.findOne({ userID: userID, finish: null, type: "work" });
    let sessions = sessions1.concat(sessions2)
    if (currentSession != null) {
      if (rangeOverlap(analyticsStart, analyticsEnd, currentSession.start, new Date())) {
        sessions.push(currentSession);
      }
    };
    sessions = dedup(sessions, (session) => session._id.toString());
    sessions.sort();

    if (sessions.length == 0) {
      return { hours: 0, minutes: 0 };
    }

    const now = new Date();
    let totalMinutes = 0;
    sessions.forEach((session) => {
      let start = (!session.start || session.start < analyticsStart) ? analyticsStart : session.start;
      let finish = (!session.finish || session.finish > analyticsEnd) ? analyticsEnd : session.finish;
      let extraSeconds = session.extraSeconds;
      const dt = finish - start;
      totalMinutes += Math.floor(dt / (1000 * 60)) + extraSeconds / 60;

      if (session.isResetPoint === true) {
        totalMinutes = 0;
      }
    });

    return {
      hours: Math.floor(totalMinutes / 60),
      minutes: Math.floor(totalMinutes % 60)
    };
  }
}

function rangeOverlap(range1Start, range1End, range2Start, range2End) {
  if (range2Start >= range1Start && range2Start <= range1End) return true;
  if (range2End >= range1Start && range2End <= range1End) return true;
  return false;
}

function dedup(array, keyFunc) {
    const map = new Map();
    array.forEach((element) => {
      map.set(keyFunc(element), element);
    });

    return Array.from(map.values());
}