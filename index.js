// add + require discord js module to project
const fs = require('fs');
const Discord = require('discord.js');

const { prefix, token } = require('./config.json');

// create a new instance of a discord client
const client = new Discord.Client();

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	//set a new item in the collection using commandname and value respectively
	client.commands.set(command.name, command);
}

// log username in log once when the client is ready
client.once('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
	client.commands.get('thoughts').execute(null, client.guilds.cache.get('311333568360087552').channels.cache.get('720073176738168832'), 'createMode');
	client.commands.get('pics').execute(null, client.guilds.cache.get('311333568360087552').channels.cache.get('759288296274001932'), 'createMode');
});

client.on("ready", () => {
	client.user.setActivity("your ass", { type: "WATCHING"});
});

// listen for messages and echo them
client.on('message', message => {
	//First, return if the message was sent by a bot to avoid a feedback loop.
	if (message.author.bot) return;

	//check for pog
	const pogFinder = message.content.toLowerCase().includes('pog');
	if (pogFinder) {
		client.commands.get('pogchamp').execute(message, null);
	}

	//Next, check if the message was sent from the thought of the davyville
	if (message.channel === client.guilds.cache.get('311333568360087552').channels.cache.get('720073176738168832')) { //add messages from davy's channel to the davy thoughts
		client.commands.get('thoughts').execute(message, '', 'addMode');
	}

	//Check if the message was sent from the picville
	if (message.channel === client.guilds.cache.get('311333568360087552').channels.cache.get('759288296274001932')) { //add messages from davy's channel to the davy thoughts
		client.commands.get('pics').execute(message, '', 'addMode');
	}

  	//If the message didn't start with the command prefix, return now
	if (!message.content.startsWith(prefix)) return;

	//Splice the command away from the prefix & rest of the message
	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

	//If there's no command in the .js library, return now.
	if (!client.commands.has(commandName)) return;

	//Create a command with the existant commandname
	const command = client.commands.get(commandName);

	//Try to execute the command
	try {
		command.execute(message, args);
	} catch(error) {
		console.error(error);
	}

});

// log in with token - MUST ADD YOUR OWN
client.login(token);
