"use strict";

let Discord = require(`discord.js`);
let Person = require(`./../classes/Entity/Person.js`);

let discord = new Discord.Client();

discord.on(`ready`, function() {
  report.log(`Discord parser started`);
});

discord.on(`error`, function(data) {
  report.error(data);
});

discord.on(`message`, async (message) => {
  //Attempt to get user by Discord ID
  getRepositoryFactory().getPersonRepository().getByDiscord(message.author.id, (personCollection) => {
    let person = personCollection.getPersons()[0];

    if (typeof(person) !== `undefined`) {
      //If user is already stored in the database
      emitter.emit('message', person);
    } else {
      //If user isn't already stored in the database construct a new user
      person = new Person();
      person.setDiscord(message.author.id);

      //Save user to database and return user with database ID
      getRepositoryFactory().getPersonRepository().saveUser(person, function(person) {
        emitter.emit('message', person)
      });
    }
  });
});

discord.login(discordCredentials.token);
