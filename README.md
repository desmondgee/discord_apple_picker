# Discord Apple Picker
A discord bot server that allows you to host multiple applications without conflicting command namespaces. It does this by providing discord users the ability to switch between your applications using slash commands. The discord user then executes commands specific to the current application by typing in chat commands prefixed with a `.`. 

# Structure
* `apples` - An apple is an application environment. They are stored in the `apples` folder in the root directory. When the bot starts up, it will scan through all your apples automatically updating Discord with a slash command for each of your apples. It also caches all of the dot commands under each of your apples.
* `properties.js` - Each apple folder contains a `properties.js` file. The program reads this file for all of the metadata needed to process the apple.
* `commands` - Each apple contains a commands folder. In this folder are js files representing each of that apple's dot commands.

# .help
By default, each apple is provided a `.help` command that contains all of the apple's dot commands along with descriptions. If you add your own help command, it will superscede this built-in help functionality.
