require('dotenv').config();
const Discord = require('discord.js');
const fs = require('fs');
const mongoose = require("mongoose");
const Profile = require("./model/profileSchema");
const Plot = require("./model/plotSchema");
const Ticker = require("./library/ticker");

const prefix = '!';

const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./command/').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./command/${file}`);
  client.commands.set(command.name, command);
}



client.once('ready', () => {
  console.log('BOT ONLINE AND READY!');
});

client.on('message', async message => {
  if(!message.content.startsWith(prefix)) return;

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

  plot = await Plot.findOne({ userID: message.author.id, serverID: message.guild.id });
  Ticker.updatePlot(profile, plot);

  const args = message.content.slice(prefix.length).split(/ +/);
  const commandName = args.shift().toLowerCase();
  const command = client.commands.get(commandName);

  if (command === undefined) {
    message.channel.send("Unknown Comamnd");
  }
  else {
    command.execute(message, args, profile, plot);
  }
});

mongoose.connect(process.env.MONGODB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
}).then(() => {
  console.log("Connected to the database");
}).catch((err) => {
  console.log(err);
});

client.login(process.env.TOKEN);