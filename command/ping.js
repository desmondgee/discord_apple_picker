module.exports = {
  name: 'ping',
  description: "this is a command!",
  execute(message, args) {
    message.channel.send("pong! bing-bong!");
  }
}