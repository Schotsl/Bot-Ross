"use strict";

process.env.NTBA_FIX_319 = 1;

let Telegram = require(`node-telegram-bot-api`);
let Person = require(`./../classes/Entity/Person.js`);

let telegram = new Telegram(telegramCredentials.token, {polling: true})

telegram.on(`load`, function() {
  report.log(`Telegram parser started`);
});

telegram.on(`error`, function(data) {
  report.error(data);
});

telegram.on(`message`, async (message) => {
  //Attempt to get user by Telegram ID
  getRepositoryFactory().getPersonRepository().getByTelegram(message.from.id, (personCollection) => {
    let person = personCollection.getPersons()[0];

    if (typeof(person) !== `undefined`) {
      //If user is already stored in the database
      emitter.emit('message', person);
    } else {
      //If user isn't already stored in the database construct a new user
      person = new Person();
      person.setTelegram(message.from.id);
      person.setFirst(message.from.first_name);
      person.setLast(message.from.last_name);

      //Save user to database and return user with database ID
      getRepositoryFactory().getPersonRepository().saveUser(person, function(person) {
        emitter.emit('message', person)
      });
    }
  });
});
