const PlotModel = require("../model/plotSchema");
const Discord = require('discord.js');
const Format = require('../library/format');
const Random = require('../library/random');

function lastExpirationDate() {
  const currentHour = new Date().getHours();

  if (currentHour >= 16) {
    return new Date().setHours(16,0,0,0);
  }
  if (currentHour >= 8) {
    return new Date().setHours(8,0,0,0);
  }

  return new Date().setHours(0,0,0,0);
}

function refreshPlots(message) {
  return ["A", "B", "C", "D", "E", "F"].map(function(letter) {
    let cost = Math.random() * Math.random() * 3000000 + 100000;
    let taxFactor = Random.bm(0, 2, 1);
    let maxRoutesFactor = Random.bm(0, 2, 1);

    return new PlotModel({
      serverID: message.guild.id,
      letter: letter,
      cost: Math.ceil(cost),
      tax: Math.ceil(cost * taxFactor) * 0.0025,
      maxRoutes: Math.ceil(cost * maxRoutesFactor / 50000),
      areaPopulation: Math.ceil(Random.bm(100, 5000000, 4)),
      areaWealth: (taxFactor + Random.bm(0, 2, 1)) / 2,
    });
  });
}

module.exports = {
  name: 'plots',
  description: "displays plots available for purchase.",
  async execute(message) {
    const expiration = new Date(lastExpirationDate())

    await PlotModel.deleteMany({
      userID: { $exists: false }, 
      createdAt: { $lte: expiration }
    }).exec();

    let plots = await PlotModel.find({ userID: { $exists: false } }).exec();

    if (plots.length == 0)
      plots = await refreshPlots(message);

    console.log(plots);

    const nextExpiration = new Date(expiration.getTime());
    nextExpiration.setHours(expiration.getHours() + 8);
    const nextExpirationHours = 8 - (new Date() - expiration) / (1000 * 60 * 60);
    let nextExpirationMessage;
    if (nextExpirationHours >= 1) {
      nextExpirationMessage = nextExpirationHours.toFixed(1) + " hours."
    }
    else {
      nextExpirationMessage = (nextExpirationHours * 60).toFixed(0) + " minutes."
    }

    const embed = new Discord.MessageEmbed()
    .setTitle("Plots For Sale")
    .setDescription("You can purchase a plot using the `!buyplot` command followed by the letter of the plot you want purchase.")
    .setFooter(`(New plots will be available in ${nextExpirationMessage})`)
    .setColor("DARK_GOLD");

    for (const plot of plots) {
      const sentences = [
        `Can hold up to ${plot.maxRoutes} bouldering routes.`,
        `Every week, you'll need to pay ${Format.dollars(plot.tax)} to cover fees, maintenance and taxes.`,
        `The surrounding city has a population of ${Format.commas(plot.areaPopulation)}.`
      ];

      embed.addFields(
        {
          name: `Plot ${plot.letter} - ${Format.dollars(plot.cost)}`, 
          value: sentences.join(" ")
        }
      )

      if (plot.isNew) plot.save();
    }

    message.channel.send(embed)
  }
}