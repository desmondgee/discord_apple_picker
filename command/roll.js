module.exports = {
  name: 'roll',
  description: "this is a command!",
  execute(message, args) {
    number = Math.ceil(Math.random() * 6);
    message.channel.send("You rolled a " + number + "!");
  }
}