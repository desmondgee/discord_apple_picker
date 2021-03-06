const Climber = require("../models/climberSchema");
const Discord = require('discord.js');
const Format = require(__basedir + '/shared_library/format');

module.exports = {
  name: 'stats',
  description: "displays your own information including current money, gym stats and income.",
  async execute(message, _args, user, plot) {
    const embed = new Discord.MessageEmbed()
    .setAuthor(message.author.username, message.author.avatarURL())
    .setColor("DARK_GOLD")
    .addFields(
      {
        name: "Cash", 
        value: Format.dollars(user.money)
      }
    )

    if (plot) {
      const climbers = await Climber.find({ plotId: plot._id }).exec();
      const gymSubfields = [
        `${plot.gymName}`,
        `Occupancy ${climbers.length}/${plot.maxRoutes * 2}`,
        `Day Pass Fee ${Format.dollars(plot.dayPass)}`
      ];
      const incomeSubfields = [
        `Today ${Format.dollars(plot.todayIncome)} (total climbers: ${plot.todayVisits})`,
        `Yesterday ${Format.dollars(plot.yesterdayIncome)} (total climbers: ${plot.yesterdayVisits})`
      ];
      const locationSubfields = [
        `Population ${Format.commas(plot.areaPopulation)}`,
        `Wealth Index ${Format.commas(plot.areaWealth)}`
      ]

      embed.addFields({ name: "Climbing Gym", value: gymSubfields.join("\n") })
      embed.addFields({ name: "Gym Location", value: locationSubfields.join("\n") })
      embed.addFields({ name: "Income", value: incomeSubfields.join("\n") })
    }

    message.channel.send({embeds: [embed]})
  }
}