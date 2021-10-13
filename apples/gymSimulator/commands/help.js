const Discord = require('discord.js');

module.exports = {
  name: 'help',
  description: "Displays available commands.",
  execute(message) {
    const lines = [
      "`.plots` - Lists plots available for purchase. Plots refresh every 8 hours.",
      "`.buyplot [plot letter]` - Purchases a plot and build your new gym on that plot.", 
      "`.stats` - Displays your current money, information about your gym, and financial stats.",
      "`.renamegym [new name]` - Renames your gym.", 
      "`.sellgym` - Sells your gym."
    ]

    const embed = new Discord.MessageEmbed()
      .setTitle("Commands")
      .setColor("DARK_GOLD")
      .setDescription(lines.join("\n"));

    message.channel.send({embeds: [embed]})
  }
}