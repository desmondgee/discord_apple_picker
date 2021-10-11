// ApplePicker is short for Application Environment Picker
// This is a discord bot that lets you modularize different applications into application environments known as "apples".
// The discord bot lets you pick between different apples using the ".apple" command.
// Only commands specific to the current apple are acknowledged.

require('dotenv').config();
const Discord = require('discord.js');
const fs = require('fs');
const mongoose = require("mongoose");
const Notice = require('../library/notice');

class ApplePicker {
  constructor() {
    // Setup Database
    mongoose.connect(process.env.MONGODB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    }).then(() => {
      console.log("Connected to the database");
    }).catch((err) => {
      console.log(err);
    });

    // Setup Application Environments
    this.appNames = fs
      .readdirSync('./apples/.', {withFileTypes: true})
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    // initialize last saved app for user
    

    // Setup Discord
    const client = new Discord.Client();
    client.commands = new Discord.Collection();
    client.once('ready', this.startHandler);
    client.on('message', this.messageHandler);
    client.login(process.env.TOKEN);
  }

  startHandler() {
    console.log('BOT ONLINE AND READY!');
  }

  async messageHandler(message) {
    if (!message.content.startsWith('.app')) return;

    const args = message.content.slice(prefix.length).split(/ +/);

    if (args.length == 1) {
      appleHelp();
      return;
    }

    const appleName = args[1].toLowerCase();
    const command = client.commands.get(commandName);
  }

  appleHelp() {
    Notice.success(channel, `Available apples to pick from are:\n`);
  }

  loadProfile() {
    let profile;
    try {
      profile = await Profile.findOne({ userID: message.author.id, serverID: message.guild.id });
      if (!profile) {
        profile = await Profile.create({
          userID: message.author.id,
          serverID: message.guild.id,
          money: 200000
        });
        profile.save();
      }
    } catch(err) {
      console.log(err);
    }
  }
}

module.exports = ApplePicker;