global.emotionValue = 0;
global.emotionState = 0;

//Hue packages
global.Hue = require('node-hue-api');
global.Api = require('node-hue-api').HueApi;
global.LightState = require('node-hue-api').lightState;

//Other packages
global.Ssh = require('simple-ssh');
global.MySQL = require('mysql');
global.Discord = require("discord.js");
global.Sentiment = require('sentiment');

//Non constructors
global.fs = require('fs');
global.settings = require('./settings.json');
global.functions = require('./functions.js');

//Custom classes
global.Light = require('./classes/light.js');
global.Report = require('./classes/report.js');
global.Command = require('./classes/command.js');
global.Blacklist = require('./classes/blacklist.js');

global.report = new Report();
global.blacklist = new Blacklist();
global.sentiment = new Sentiment();

//Credentials
const hueCredentialsLocation = './credentials/hue.json';
const sshCredentialsLocation = './credentials/shh.json';
const mySQLCredentialsLocation = './credentials/mysql.json';
const discordCredentialsLocation = './credentials/discord.json';
const scontrolCredentialsLocation = './credentials/scontrol.json';

if (fs.existsSync(hueCredentialsLocation)) global.hueCredentials = require(hueCredentialsLocation);
if (fs.existsSync(sshCredentialsLocation)) global.sshCredentials = require(sshCredentialsLocation);
if (fs.existsSync(mySQLCredentialsLocation)) global.mySQLCredentials = require(mySQLCredentialsLocation);
if (fs.existsSync(discordCredentialsLocation)) global.discordCredentials = require(discordCredentialsLocation);
if (fs.existsSync(scontrolCredentialsLocation)) global.scontrolCredentials = require(scontrolCredentialsLocation);

global.bot = new Discord.Client();
global.api = new Api(hueCredentials['host'], hueCredentials['username']);

global.lampArray = new Array();
global.commandArray = new Array();

//Collection entity
let PersonCollection = require('./classes/Collection/PersonCollection.js');
let SentenceCollection = require('./classes/Collection/SentenceCollection.js');

//Mapper entity
let PersonMapper = require('./classes/Mapper/Person.js');
let SentenceMapper = require('./classes/Mapper/Sentence.js');
let PersonCollectionMapper = require('./classes/Mapper/PersonCollection.js');
let SentenceCollectionMapper = require('./classes/Mapper/SentenceCollection.js');

//Repository entity
let PersonRepository = require('./classes/Repository/PersonRepository.js');
let SentenceRepository = require('./classes/Repository/SentenceRepository.js');

//Create mapper
let personMapper = new PersonMapper;
let sentenceMapper = new SentenceMapper;
let personCollectionMapper = new PersonCollectionMapper(personMapper);
let sentenceCollectionMapper = new SentenceCollectionMapper(sentenceMapper);

//Create repositories
global.personRepository = new PersonRepository(personCollectionMapper);
global.sentenceRepository = new SentenceRepository(sentenceCollectionMapper);

//Turn light id array into Light array
settings['lamps'].forEach(function(officeLightId) {
  let lampSingle = new Light(officeLightId, api);
  lampArray.push(lampSingle);
});
report.log(`Loaded ${lampArray.length} lights`);

//Load commands into array
fs.readdirSync(`./commands`).forEach(file => {
  let tempClass = require(`./commands/${file}`);
  let tempObject = new tempClass();
  commandArray.push(tempObject);
});
report.log(`Loaded ${commandArray.length} commands`);

bot.on("ready", function() {
  report.log(`Bot is ready. ${bot.user.username}`);
  bot.generateInvite(["ADMINISTRATOR"]).then((data) => report.log(data));

  bot.user.setActivity('with neutral feelings');
  setInterval(functions.setEmotions, 100);
});

bot.on("error", function(data) {
  report.error(data);
});

bot.on("message", async(message) => {
  //Detect mention
  message.mentions.users.forEach((user) => {
      if (user.id === bot.user.id) emotionValue += sentiment.analyze(message.content).comparative;
  });

  //Detect person score
  personRepository.getByDiscord(message.author.id, (users) => {
    users.getPersons().forEach((user) => {
      user.score += sentiment.analyze(message.content).comparative;
      personRepository.updateUser(user);
    })
  })

  //Detect command
  if (message.content.startsWith(settings.prefix)) {
    if (blacklist.checkId(message.author.id)) {
      sentenceRepository.getClosestIntention('deny', emotionValue, (sentenceCollection) => {
        message.channel.send(sentenceCollection.getSentences()[0].getContent());
      });
    }

    //Parse command
    let splitMessage = message.content.split(" ");
    let command = splitMessage[0].substring(1);
    let params = splitMessage.slice(1);

    commandArray.forEach((commandObject) => {
      if (commandObject.match(command)) commandObject.executeDefault(command, params, message);
    })
  }
})

bot.login(discordCredentials.token);
