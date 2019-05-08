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
global.Light = require('./classes/light.js')
global.Report = require('./classes/report.js');
global.Command = require('./classes/command.js')
global.Language = require('./classes/language.js')
global.Blacklist = require('./classes/blacklist.js');

global.report = new Report();
global.language = new Language();
global.blacklist = new Blacklist();
global.sentiment = new Sentiment();

//Credentials
const hueCredentialsLocation = './credentials/hue.json';
const sshCredentialsLocation = './credentials/shh.json';
const mySQLCredentialsLocation = './credentials/mysql.json';
const discordCredentialsLocation = './credentials/discord.json';
const scontrolCredentialsLocation = './credentials/scontrol.json';

if (fs.existsSync(hueCredentialsLocation)) var hueCredentials = require(hueCredentialsLocation);
if (fs.existsSync(sshCredentialsLocation)) var sshCredentials = require(sshCredentialsLocation);
if (fs.existsSync(mySQLCredentialsLocation)) var mySQLCredentials = require(mySQLCredentialsLocation);
if (fs.existsSync(discordCredentialsLocation)) var discordCredentials = require(discordCredentialsLocation);
if (fs.existsSync(scontrolCredentialsLocation)) var scontrolCredentials = require(scontrolCredentialsLocation);

global.bot = new Discord.Client();
global.ssh = new Ssh(sshCredentials);
global.api = new Api(hueCredentials['host'], hueCredentials['username']);
global.connection = MySQL.createConnection(mySQLCredentials);
connection.connect();

global.lampArray = new Array();
global.commandArray = new Array();

//Collection entity
let PersonCollection = require('./classes/Collection/PersonCollection.js');

//Mapper entity
let PersonMapper = require('./classes/Mapper/Person.js');
let PersonCollectionMapper = require('./classes/Mapper/PersonCollection.js');

//Repository entity
let PersonRepository = require('./classes/Repository/PersonRepository.js');

//Create mapper
let personMapper = new PersonMapper;
let personCollectionMapper = new PersonCollectionMapper(personMapper);

//Create repositories
global.personRepository = new PersonRepository(personCollectionMapper);

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
  setInterval(functions.updateEmotions, 100);
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
    if (blacklist.checkId(message.author.id)) language.respond('deny', emotionValue, (response) => message.channel.send(response));

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
