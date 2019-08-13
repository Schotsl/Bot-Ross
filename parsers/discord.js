"use strict";

let Discord = require(`discord.js`);
let Person = require(`./../classes/Entity/Person.js`);
let Status = require(`./../classes/Entity/Status.js`);
let Message = require(`./../classes/Entity/Message.js`);

let discord = new Discord.Client();

discord.on(`ready`, function() {
  report.log(`Discord parser started`);
});

discord.on(`error`, function(data) {
  report.error(data);
});

discord.on(`message`, async (discordMessageObject) => {
  //If person is a bot
  if (discordMessageObject.author.bot) return;

  //Attempt to get user by Discord ID
  discordIdToPersonObject(discordMessageObject.author.id, (person) => {

    //Create respond function to pass along
    let respond = function(response) {
      let messageObject = new Message();
      messageObject.setPerson(person.id);
      messageObject.setContent(response);
      messageObject.setRecieved(0);

      getRepositoryFactory().getMessageRepository().saveMessage(messageObject, function() {
        //Emit custom message event
        discordMessageObject.channel.send(messageObject.content);
      });
    }

    //Get actual message
    let messageObject = new Message();
    messageObject.setPerson(person.id);
    messageObject.setContent(discordMessageObject.content);
    messageObject.setRecieved(1);

    getRepositoryFactory().getMessageRepository().saveMessage(messageObject, function() {
      //Emit custom message event
      emitter.emit('message', messageObject.content, respond, person)
    });
  });
});

discord.on("presenceUpdate", function(oldDiscordUserObject, newDiscordUserObject) {
  let oldStatus = oldDiscordUserObject.presence.status;
  let newStatus = newDiscordUserObject.presence.status;

  //If status has changed
  if (oldStatus !== newStatus) {
    discordIdToPersonObject(newDiscordUserObject.id, function(person) {
      let status = new Status();

      status.setPerson(person.id);
      status.setPlatform(`discord`);
      status.setState(newStatus);

      getRepositoryFactory().getStatusRepository().saveStatus(status);
    })
  }
});

discord.login(discordCredentials.token);

function discordIdToPersonObject(discordId, callback) {
  getRepositoryFactory().getPersonRepository().getByDiscord(discordId, (personCollection) => {
    //Get single person from array
    let person = personCollection.getPersonArray()[0];

    //If person object is found in database
    if (typeof(person) !== `undefined`) {
      //Return person object
      callback(person);
    } else {
      //Create new person object
      person = new Person();
      person.setDiscord(discordId);

      //Save user to database and return user with database ID
      getRepositoryFactory().getPersonRepository().saveUser(person, function(person) {
        callback(person);
      });
    }
  });
}
