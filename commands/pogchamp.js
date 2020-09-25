module.exports = {
	name: 'pogchamp',
	cooldown: 5,
	description: 'Responds to instances of pog with a pogchamp emoji',
	execute(message, args) {
		var serverEmojis = message.channel.guild.emojis.cache;
		var reactEmoji;
		for (emoji of serverEmojis) {
			if (emoji[1].name === 'pogchamp') {
				reactEmoji = emoji[1];
			}
		}
		if (reactEmoji) {
			message.react(reactEmoji);
		}
	},
};
