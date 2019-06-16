"use strict";

// TODO's:
// - Fix naming of object/array/collections
// - Fix discord user properties
// - Store query in variable
// - Double check class naming

global.emotionValue = 0;
global.emotionState = 0;

//Other packages
global.MySQL = require(`mysql`);
global.Discord = require(`discord.js`);
global.Sentiment = require(`sentiment`);

//Non constructors
global.fs = require(`fs`);
global.settings = require(`./settings.json`);
global.functions = require(`./functions.js`);

//Custom classes
global.Report = require(`./classes/report.js`);
global.Command = require(`./classes/command.js`);
global.Protocol = require(`./classes/protocol.js`);

global.report = new Report();
global.sentiment = new Sentiment();

//Credentials
const hueCredentialsLocation = `./credentials/hue.json`;
const mySQLCredentialsLocation = `./credentials/mysql.json`;
const discordCredentialsLocation = `./credentials/discord.json`;

if (fs.existsSync(hueCredentialsLocation)) global.hueCredentials = require(hueCredentialsLocation);
if (fs.existsSync(mySQLCredentialsLocation)) global.mySQLCredentials = require(mySQLCredentialsLocation);
if (fs.existsSync(discordCredentialsLocation)) global.discordCredentials = require(discordCredentialsLocation);

global.bot = new Discord.Client();
global.commandArray = new Array();
global.protocolArray = new Array();

global.getMapperFactory = function() {
  let MapperFactory = require(`./classes/Mapper/MapperFactory.js`);
  return new MapperFactory();
}

global.getRepositoryFactory = function() {
  let RepositoryFactory = require('./classes/Repository/RepositoryFactory.js');
  return new RepositoryFactory(getMapperFactory());
}

//Load commands into array
fs.readdirSync(`./commands`).forEach(file => {
  if (functions.getFileExtension(file) === `.js`) {
    let tempClass = require(`./commands/${file}`);
    let tempObject = new tempClass();
    commandArray.push(tempObject);
  }
});
report.log(`Loaded ${commandArray.length} commands`);

let protocolData = {};
if (fs.existsSync("protocols/data.json")) {
  protocolData = JSON.parse(fs.readFileSync("protocols/data.json"));
}

fs.readdirSync(`./protocols`).forEach(file => {
  if (functions.getFileExtension(file) === `.js`) {
    let tempClass = require(`./protocols/${file}`);
    let tempObject = new tempClass();

    //Add object to data file if it doesn't excist
    if (typeof(protocolData[tempObject.constructor.name]) === `undefined`) protocolData[tempObject.constructor.name] = {};
    fs.writeFileSync("./protocols/data.json", JSON.stringify(protocolData));

    //Add array to date file if it doesn't excist
    tempObject.protocols.forEach((singleArrayThing) => {
      if (typeof(protocolData[tempObject.constructor.name][singleArrayThing.name]) === `undefined`) {
        protocolData[tempObject.constructor.name][singleArrayThing.name] = 0;
        fs.writeFileSync("./protocols/data.json", JSON.stringify(protocolData));
      }
    });

    tempObject.protocols.forEach((singleArrayThing) => {
      if (singleArrayThing.interval.enabled) {
        let tempInterval = singleArrayThing.interval.value;
        let tempFunction = singleArrayThing.function;

        let tempDiffrence = new Date().getTime() - protocolData[tempObject.constructor.name][singleArrayThing.name];
        let tempTimeout = tempInterval - tempDiffrence > 0 ? tempInterval - tempDiffrence : 0;

        setTimeout(() => {
          tempObject[tempFunction]();
          protocolData[tempObject.constructor.name][singleArrayThing.name] = new Date().getTime();
          fs.writeFileSync("./protocols/data.json", JSON.stringify(protocolData))

          setInterval(() => {
            tempObject[tempFunction]();
            protocolData[tempObject.constructor.name][singleArrayThing.name] = new Date().getTime();
            fs.writeFileSync("./protocols/data.json", JSON.stringify(protocolData))
          }, tempInterval);
        }, tempTimeout);
      } else {
        tempObject[singleArrayThing.function]();
      }
    });
  }
});

bot.on(`ready`, function() {
  report.log(`Bot is ready. ${bot.user.username}`);
  bot.generateInvite([`ADMINISTRATOR`]).then((data) => report.log(data));

  bot.user.setActivity(`with neutral feelings`);
  setInterval(functions.setEmotions, 100);
});

bot.on(`error`, function(data) {
  report.error(data);
});

bot.on(`message`, async (message) => {
  //Detect mention
  message.mentions.users.forEach((user) => {
    if (user.id === bot.user.id) emotionValue += sentiment.analyze(message.content).comparative;
  });

  //Detect person score
  getRepositoryFactory().getPersonRepository().getByDiscord(message.author.id, (personCollection) => {
    let person = personCollection.getPersons()[0];

    if (typeof(person) === `undefined`) {
      let Person = require(`./classes/Entity/Person.js`);

      person = new Person();
      person.setDiscord(message.author.id);
      getRepositoryFactory().getPersonRepository().saveUser(person, () => {
        person.score += sentiment.analyze(message.content).comparative;
        person.discord_url = bot.users.get(message.author.id).avatarURL;
        person.discord_user = message.author.user;

        getRepositoryFactory().getPersonRepository().updateUser(person);
      });
    } else {
      person.score += sentiment.analyze(message.content).comparative;
      person.discord_url = bot.users.get(message.author.id).avatarURL;
      person.discord_user = message.author.username;

      getRepositoryFactory().getPersonRepository().updateUser(person);
    }
  })

  //Detect command
  if (message.content.startsWith(settings.prefix)) {

    //Parse command
    let splitMessage = message.content.split(" ");
    let command = splitMessage[0].substring(1);
    let params = splitMessage.slice(1);

    commandArray.forEach((commandObject) => {
      commandObject.execute(command, params, message);
    })
  }
})

bot.login(discordCredentials.token);
