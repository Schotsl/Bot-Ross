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

telegram.on(`message`, async (telegramMessageObject) => {
  //If person is a bot
  if (telegramMessageObject.from.bot) return;

  //Attempt to get user by Telegram ID
  getRepositoryFactory().getPersonRepository().getByTelegram(telegramMessageObject.from.id, (personCollection) => {
    //Get single person from array
    let person = personCollection.getPersons()[0];

    //Create respond function to pass along
    let respond = function(response) {
      telegram.sendMessage(telegramMessageObject.chat.id, response);
    }

    //Get actual message
    let message = telegramMessageObject.text;

    if (typeof(person) !== `undefined`) {
      //If user is already stored in the database
      emitter.emit('message', message, respond, person)
    } else {
      //If user isn't already stored in the database construct a new user
      person = new Person();
      person.setTelegram(telegramMessageObject.from.id);
      person.setFirst(telegramMessageObject.from.first_name);
      person.setLast(telegramMessageObject.from.last_name);

      //Save user to database and return user with database ID
      getRepositoryFactory().getPersonRepository().saveUser(person, function(person) {
        emitter.emit('message', message, respond, person)
      });
    }
  });
});
