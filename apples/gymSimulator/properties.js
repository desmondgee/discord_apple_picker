const Ticker = require("./library/ticker");
const Plot = require("./models/plotSchema");
const User = require("./models/userSchema");
const Notice = require(__basedir + '/shared_library/notice');

module.exports = {
  displayName: 'Climbing Gym Simulator',
  pickerNames: [
    'gym'
  ],
  abbreviation: 'cgs',
  description: 'Buy a piece of land, manage its pricing and watch as the money rolls in!',
  async decorator(callback, message, args, profile) {
    let user;
    try {
      user = await User.findOne({ profileId: profile._id });
      if (!user) {
        user = await User.create({
          profileId: profile._id,
          money: 200000
        });
        user.save();
      }
    } catch(err) {
      console.log(err);
    }

    plot = await Plot.findOne({ userId: user._id });
    Ticker.updatePlot(user, plot);

    callback(message, args, user, plot);
  }
}

