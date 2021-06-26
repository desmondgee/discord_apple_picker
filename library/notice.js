const Discord = require('discord.js');

module.exports = {
  error(channel, message) {
    const embed = new Discord.MessageEmbed().setDescription(message).setColor("DARK_RED");
    channel.send(embed)
  },
  success(channel, message) {
    const embed = new Discord.MessageEmbed().setDescription(message).setColor("DARK_GREEN");
    channel.send(embed)
  }
}