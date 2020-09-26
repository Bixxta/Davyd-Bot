const fs = require('fs');
const path = require("path");

const PICS_PATH = path.resolve(__dirname, './pics/pics.txt');

var numLoops = 0;

module.exports = {
	name: 'pics',
	cooldown: 3,
	description: 'Shows you a random davyd pic',
	execute(message, args, mode) {
		if (mode === 'createMode') {
			createPicList(args, addPic, '0');
		} else if (mode === 'addMode') {
			addPic(message);
		} else {
			openPics(message, displayMessage);
		}
	},
};

function createPicList(davyHome, callback, prevId) {
	fs.writeFile(PICS_PATH, '', function (err) {
  		if (err) {
  			console.error('Failed to create new davy pics file');
  		}
	});
	davyHome.messages.fetch({limit: 100, before: prevId})
    .then(messages => {
    	var lowestTimestamp = Number.MAX_SAFE_INTEGER; //find the earliest message
	   	for (message of messages) {
			if (message[1].createdTimestamp < lowestTimestamp) { //check the timestamp of each message, find the one with the earliest timestamp (first up)
				prevId = message[0];
			}
			callback(message[1]);
		}
    	if (messages.size == 100) { //if we read in 100 messages, try again because there are more to read
    		createPicList(davyHome, callback, prevId); //recur this function with the new previd to find the next 100 messages up
    	}
    })
    .catch(console.error);
}

function addPic(message) { //adds all pics from a given message
	var messageToAdd = message.content + '\n'; //check if the message is just a picture url (which is valid; if so, just grab that)
	if (messageToAdd === '\n') { //it's attachment(s) instead, so add them all by url
		messageToAdd = ''; //reset this string because it's currently a newline
		for (attachment of message.attachments) {
			messageToAdd += attachment[1].proxyURL + '\n'; //for each attachment, get the proxyurl and add it to the string with a newline
		}
	}
    fs.appendFile(PICS_PATH, messageToAdd, function (err) { //just add the most recent thought by way of appending it
      if (err) {
        console.error('Failed to add pic');
      }
    });
}

//function that searches the given list of davy pics for a specific one and sends its url as a message
function openPics(message, callback) {
	fs.readFile(PICS_PATH, function(err, data) {
		if (err) {
			message.channel.send(`Uh oh, something went wrong. (This isn't a pic)`);
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
