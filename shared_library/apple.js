const fs = require('fs');
const Notice = require('./notice');

class Apple {
  constructor(folder) {
    this.folder = folder;

    // Copy over module properties
    const module = require(`../apples/${folder}/properties.js`);
    this.displayName = module.displayName;
    this.pickerNames = module.pickerNames;
    this.abbreviation = module.abbreviation;
    this.description = module.description;
    this.decorator = module.decorator;

    // Load dot commands
    this.dotCommands = new Map();
    this.helpText;
    const jsFiles = fs.readdirSync(`./apples/${folder}/commands/.`);
    for (let file of jsFiles) {
      const dotCommand = require(`../apples/${folder}/commands/${file}`);
      this.dotCommands.set(dotCommand.name, dotCommand);

      // Generate help text
      const line = `\`.${dotCommand.name}\` - ${dotCommand.description}`
      if (this.helpText == null) {
        this.helpText = line;
      }
      else {
        this.helpText += "\n" + line;
      }
    }
  }

  consume(message, profile) {
    const components = message.content.slice(1).split(/ +/);
    if (components.length == 0) { return; }
     
    if (!this.dotCommands.has(components[0])) {
      if (components[0] == "help") {
        message.reply({
          "embeds": [{
            "title": "Available Dot Commands",
            "description": this.helpText
          }]
        });
      }
      else {
        message.reply({
          content: 'Unknown dot command'
        });
      }

      return;
    }

    const dotCommand = this.dotCommands.get(components[0]);

    if (this.decorator == null) {
      dotCommand.execute(message, components.slice(1), profile);
    }
    else {
      this.decorator(dotCommand.execute, message, components.slice(1), profile);
    }
  }
}

module.exports = Apple;