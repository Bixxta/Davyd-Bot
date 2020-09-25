const fs = require('fs');
const path = require("path");

const THOUGHT_PATH = path.resolve(__dirname, './Thoughts/thoughts.txt');

module.exports = {
	name: 'thoughts',
	cooldown: 3,
	description: 'Tells you a random Davyd thought',
	execute(message, args, mode) {
		if (mode === 'createMode') {
			createThoughts(args, storeThoughtsInFile);
		} else if (mode === 'addMode') {
			addThoughts(message);
		} else {
			openThoughts(message, displayMessage);
		}
	},
};

function createThoughts(davyHome, callback) {
  davyHome.messages.fetch({limit: 100})
    .then(messages => callback(messages))
    .catch(console.error);
}

function storeThoughtsInFile(messages) {
  fs.writeFile(THOUGHT_PATH, '', function (err) {
  	if (err) {
  		console.error('Failed to create new davy thoughts file');
  	}
  });
  //console.log(messages);
  for (message of messages) {
  	fs.appendFile(path.resolve(__dirname, './Thoughts/thoughts.txt'), message[1].content + '\n', function(err) {
  		if (err) {
  			console.error('Failed to add thought');
  		}
  	})
  }
}

function addThoughts(message) {
    fs.appendFile(THOUGHT_PATH, message.content + '\n', function (err) {
      if (err) {
        console.error('Failed to write new davy thought to file');
      } else {
        console.log('Successfully wrote new davy thought ' + message.content + ' to file');
      }
    });
}

//function that searches the given list of cards for a specific one and sends its associated url as a message
function openThoughts(message, callback) {
	fs.readFile(THOUGHT_PATH, function(err, data) {
		if (err) {
			message.channel.send(`Uh oh, something went wrong. (This isn't a thought)`);
			return console.log(err);
		}
		var thoughts = data.toString().split('\n');
		callback(message, thoughts);
	});
}
//Function that takes the retrieved thought list, picks one at random, and displays it
function displayMessage(message, thoughtList) {
	var chosenThought = Math.floor(Math.random() * (thoughtList.length - 1)); //-1 because of the newline at the end
	message.channel.send(thoughtList[chosenThought]);
}
