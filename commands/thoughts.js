const fs = require('fs');
const path = require("path");

const THOUGHT_PATH = path.resolve(__dirname, './Thoughts/thoughts.txt');

module.exports = {
  name: 'thoughts',
  cooldown: 3,
  description: 'Tells you a random Davyd thought',
  execute(message, args, mode) {
    if (mode === 'createMode') {
      createThoughts(args, addThoughts, '0');
    } else if (mode === 'addMode') {
      addThoughts(message);
    } else {
      openThoughts(message, displayMessage);
    }
  },
};

function createThoughts(davyHome, callback, prevId) {
  fs.writeFile(THOUGHT_PATH, '', function (err) {
    if (err) {
      console.error('Failed to create new davy thoughts file');
    }
  });
  davyHome.messages.fetch({limit: 100, before: prevId })
    .then(messages =>  {
      var lowestTimestamp = Number.MAX_SAFE_INTEGER; //find the earliest message
      for (message of messages) {
        if (message[1].createdTimestamp < lowestTimestamp) { //check the timestamp of each message, find the one with the earliest timestamp (first up)
          prevId = message[0];
        }
        callback(message[1]); //we still need to process the most recent 100 messages eventually
      }
      if (messages.size == 100) { //if we read in 100 messages, try again because there are more to read
        createPicList(davyHome, callback, prevId); //recur this function with the new previd to find the next 100 messages up
      }
    })
    .catch(console.error);
}

function addThoughts(message) {
  fs.appendFile(THOUGHT_PATH, message.content + '\n', function (err) { //just add the most recent thought by way of appending it
    if (err) {
      console.error('Failed to write new davy thought to file');
    }
  });
}

//function that searches the given list of thoughts for a specific one and sends it as a message
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
