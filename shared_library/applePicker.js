// ApplePicker is short for Application Environment Picker
// This is a discord bot that lets you modularize different applications into application environments known as "apples".
// The discord bot lets you pick between different apples using the /apple command.
// Only commands specific to the current apple are acknowledged.

require('dotenv').config();
const { Client, Intents } = require('discord.js');
const fs = require('fs');
const mongoose = require("mongoose");
const Notice = require('./notice');
const Apple = require('./apple');
const Profile = require('../shared_models/profileSchema');

class ApplePicker {
  constructor() {
    // Setup Database
    console.log('Connecting to Mongo DB..');
    mongoose.connect(process.env.MONGODB, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }).then(() => {
      console.log("Mongo DB connection established!");
    }).catch((err) => {
      console.log(err);
    });

    // Setup Application Environments
    console.log('Searching for local apples..');
    const appleFolders = fs
      .readdirSync('./apples/.', { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);
    this.apples = appleFolders.map(folder => new Apple(folder));
    this.appleAbbreviations = new Map()
    this.appleCommands = new Map()

    for (let apple of this.apples) {
      this.appleAbbreviations.set(apple.abbreviation, apple);
      for (let command of apple.pickerNames) {
        this.appleCommands.set(command, apple);
      }
    }
    
    // Setup Discord
    console.log('Opening socket to Discord..');
    this.client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
    this.client.once('ready', () => this.readyHandler());
    this.client.on('messageCreate', msg => this.messageHandler(msg));
    this.client.on('interactionCreate', ix => this.interactionHandler(ix));
    this.client.login(process.env.DISCORD_TOKEN);
  }

  readyHandler() {
    console.log('Syncing slash commands to Discord..');
    let commands;
    if (process.env.STAGE == 'production') {
      commands = this.client.application.commands;
    }
    else {
      commands = this.client.guilds.cache.get(process.env.GUILD_ID)?.commands
    }
    
    commands.set([
      {
        name: 'ping',
        description: 'pong'
      },
      {
        name: 'apple',
        description: 'Changes dot syntax application environment',
        type: 1,
        options: this.buildAppleOptions()
      }
    ])
      // .then(msg => console.log("Slash commands sync success! Server response body:\n" + JSON.stringify(msg, null, 4)))
      .then(msg => console.log("Slash commands sync success!"))
      .catch(msg => console.error("Slash commands sync error - " + msg))
    
    console.log('Discord socket connection is ready!');
  }

  buildAppleOptions() {
    const options = []

    for (const [command, {displayName, description}] of this.appleCommands) {
      options.push({
        name: command,
        description: `${displayName} - ${description}`,
        type: 1
      });
    }

    return options
  }

  async interactionHandler(interaction) {
    console.log(`Got interaction ${interaction.type}`);

    if (!interaction.isCommand()) {
      console.log('Non-command interaction received.');
      return;
    }

    const { commandName, options: { _subcommand: subcommand } } = interaction
    console.log(`Replying to the "${commandName}" command..`);
  
    switch(commandName) {
      case 'ping':
        interaction.reply({
          content: 'pong',
          ephemeral: true
        })
        break;
      case 'apple':
        console.log(`Looking up apple for "${subcommand}"..`);
        const apple = this.appleCommands.get(subcommand);
        await this.setUserApple(interaction, apple.abbreviation);

        interaction.reply({
          content: `${apple.displayName} dot syntax application environment is ready.`,
          ephemeral: true
        });
    }
  }

  async setUserApple(interaction, appleAbbreviation) {
    let profile = await Profile.findOne({ userId: interaction.user.id, guildId: interaction.guildId });
    if (profile == null) {
      await Profile.create({
        userId: interaction.user.id,
        guildId: interaction.guildId,
        apple: appleAbbreviation
      });
    }
    else {
      profile.apple = appleAbbreviation;
      await profile.save();
    }
  }

  async messageHandler(message) {
    console.log(`Running message handler..`);
    if (!message.content.startsWith('.')) return;

    console.log(`Replying to the dot message: "${message.content}"`);
    
    const profile = await Profile.findOne({ userId: message.author.id, guildId: message.guild.id });
    
    if (profile == null || profile.apple == null) {
      console.log(`User has not selected an apple!`);
      return;
    }

    const apple = this.appleAbbreviations.get(profile.apple);
    console.log(`Apple ${apple.displayName} found. Consuming message..`);
    apple.consume(message, profile);
  }

  async loadProfile() {
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
