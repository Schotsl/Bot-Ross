"use strict";

// TODO's:
// - Fix naming of object/array/collections
// - Fix discord user properties
// - Store query in variable
// - Double check class naming

global.emotionValue = 0;
global.emotionState = 0;

//Other packages
global.Ssh = require(`simple-ssh`);
global.MySQL = require(`mysql`);
global.Discord = require(`discord.js`);
global.Sentiment = require(`sentiment`);

//Non constructors
global.fs = require(`fs`);
global.uniqid = require('uniqid');
global.request = require(`request`);
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
const sshCredentialsLocation = `./credentials/shh.json`;
const mySQLCredentialsLocation = `./credentials/mysql.json`;
const discordCredentialsLocation = `./credentials/discord.json`;
const scontrolCredentialsLocation = `./credentials/scontrol.json`;

if (fs.existsSync(hueCredentialsLocation)) global.hueCredentials = require(hueCredentialsLocation);
if (fs.existsSync(sshCredentialsLocation)) global.sshCredentials = require(sshCredentialsLocation);
if (fs.existsSync(mySQLCredentialsLocation)) global.mySQLCredentials = require(mySQLCredentialsLocation);
if (fs.existsSync(discordCredentialsLocation)) global.discordCredentials = require(discordCredentialsLocation);
if (fs.existsSync(scontrolCredentialsLocation)) global.scontrolCredentials = require(scontrolCredentialsLocation);

global.bot = new Discord.Client();
global.commandArray = new Array();
global.protocolArray = new Array();

//Collection entity
let LogCollection = require('./classes/Collection/LogCollection.js');
let LightCollection = require('./classes/Collection/LightCollection.js');
let PersonCollection = require('./classes/Collection/PersonCollection.js');
let SentenceCollection = require('./classes/Collection/SentenceCollection.js');

//Mapper entity
let LogMapper = require(`./classes/Mapper/Log.js`);
let LightMapper = require(`./classes/Mapper/Light.js`);
let PersonMapper = require(`./classes/Mapper/Person.js`);
let SentenceMapper = require(`./classes/Mapper/Sentence.js`);

let LogCollectionMapper = require(`./classes/Mapper/LogCollection.js`);
let LightCollectionMapper = require(`./classes/Mapper/LightCollection.js`);
let PersonCollectionMapper = require(`./classes/Mapper/PersonCollection.js`);
let SentenceCollectionMapper = require(`./classes/Mapper/SentenceCollection.js`);

//Repository entity
let LogRepository = require(`./classes/Repository/LogRepository.js`);
let LightRepository = require(`./classes/Repository/LightRepository.js`);
let PersonRepository = require(`./classes/Repository/PersonRepository.js`);
let SentenceRepository = require(`./classes/Repository/SentenceRepository.js`);

//Create mapper
let logMapper = new LogMapper;
let lightMapper = new LightMapper;
let personMapper = new PersonMapper;
let sentenceMapper = new SentenceMapper;

let logCollectionMapper = new LogCollectionMapper(logMapper);
let lightCollectionMapper = new LightCollectionMapper(lightMapper);
let personCollectionMapper = new PersonCollectionMapper(personMapper);
let sentenceCollectionMapper = new SentenceCollectionMapper(sentenceMapper);

//Create repositories
global.logRepository = new LogRepository(logCollectionMapper);
global.lightRepository = new LightRepository(lightCollectionMapper);
global.personRepository = new PersonRepository(personCollectionMapper);
global.sentenceRepository = new SentenceRepository(sentenceCollectionMapper);

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
      let tempInterval = singleArrayThing.interval;
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

bot.on(`message`, async(message) => {
  //Detect mention
  message.mentions.users.forEach((user) => {
      if (user.id === bot.user.id) emotionValue += sentiment.analyze(message.content).comparative;
  });

  //Detect person score
  personRepository.getByDiscord(message.author.id, (personCollection) => {
    let person = personCollection.getPersons()[0];

    if (typeof(person) === `undefined`) {
      let Person = require(`./classes/Entity/Person.js`);

      person = new Person();
      person.setDiscord(message.author.id);
      personRepository.saveUser(person, () => {
        person.score += sentiment.analyze(message.content).comparative;
        person.discord_url = bot.users.get(message.author.id).avatarURL;
        person.discord_user = message.author.user;

        personRepository.updateUser(person);
      });
    } else {
      person.score += sentiment.analyze(message.content).comparative;
      person.discord_url = bot.users.get(message.author.id).avatarURL;
      person.discord_user = message.author.username;

      personRepository.updateUser(person);
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

let Log = require('./classes/Entity/Log.js');

bot.on(`voiceStateUpdate`, function(oldMember, newMember) {
  let state = "";

  //If voice channel change
  if (oldMember.voiceChannelID !== newMember.voiceChannelID) {
    if (newMember.voiceChannelID !== null && oldMember.voiceChannelID !== null) state = "changed";
    else if (oldMember.voiceChannelID === null) state = "joined";
    else if (newMember.voiceChannelID === null) state = "left";
  }

  //If voice mute change
  if (oldMember.selfMute !== newMember.selfMute) {
    if (newMember.selfMute) state = "muted";
    else state = "unmuted";
  }

  //If voice mute change
  if (oldMember.selfDeaf !== newMember.selfDeaf) {
    if (newMember.selfDeaf) state = "deafened";
    else state = "undeafened";
  }

  personRepository.getByDiscord(newMember.id, (personCollection) => {
    let person = personCollection.getPersons()[0];

    //Not ideal, if user is still being registered to the database they wont be logged
    if (typeof(person) !== `undefined`) {
      let log = new Log();

      log.setPerson(person.getId());
      log.setState(state);

      logRepository.saveLog(log);
    }
  })
});

bot.on(`presenceUpdate`, function(oldMember, newMember) {
  let state = "";

  //If status change
  if (oldMember.presence.status !== newMember.presence.status) {
    state = newMember.user.presence.status
  }

  personRepository.getByDiscord(newMember.id, (personCollection) => {
    let person = personCollection.getPersons()[0];

    //Not ideal, if user is still being registered to the database they wont be logged
    if (typeof(person) !== `undefined`) {
      let log = new Log();

      log.setPerson(person.getId());
      log.setState(state);

      logRepository.saveLog(log);
    }
  })
});
