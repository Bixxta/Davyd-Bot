module.exports = {
	name: 'roll',
	cooldown: 1,
	description: 'Rolls one of a number of die',
	execute(message, args) {
		if (args[0] && (args[0][0] == 'd')) { //make sure they did it in the form of d[int]
			var command = args[0].slice(1); //slice the d off
			if (!isNaN(command) && command == Math.ceil(command) && !isNaN(command[0])) { //checks if the command is a number, which is also an integer, and which is also not negative (-)
				var chosenRoll = Math.ceil(Math.random() * (command)); //roll a random number between 1 and command
				var messageToSend = 'On a D' + command + ', you rolled a ' + chosenRoll + '.';
				if (chosenRoll == 1) {
					messageToSend = messageToSend + ' Ouch, my dude.';
				} else if (chosenRoll == command) {
					messageToSend = messageToSend + ' That is mint!';
				} else if (chosenRoll == 69) {
					messageToSend = messageToSend + ` Funny!`;
				} else if (chosenRoll == 420) {
					messageToSend = messageToSend + ` Weed is just funny plant.`;
				}
				message.channel.send(messageToSend);
				return;
			}
		}
		message.channel.send('Correct Usage: ~roll d[integer]');
		//d6, d20, d12, d8, d4. d100, d10
	},
};
