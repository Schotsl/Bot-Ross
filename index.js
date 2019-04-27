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
global.Person = require('./classes/person.js')
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
global.personArray = new Array();
global.commandArray = new Array();

//Turn light id array into Light array
settings['lamps'].forEach(function(officeLightId) {
  let lampSingle = new Light(officeLightId, api);
  lampArray.push(lampSingle);
});
report.log(`Loaded ${lampArray.length} lights`);

//Load commands into array
connection.query(`SELECT \`id\`, \`first\`, \`last\`, \`email\`, \`adres\`, \`postal\`, \`city\`, \`birthday\`, \`insta\`, \`discord\`, \`twitter\`, \`ip\` FROM \`persons\` WHERE 1`, function (error, dataArray) {
  dataArray.forEach((singleData) => {
    let tempObject = new Person();

    if (singleData.id) tempObject.id = singleData.id;
    if (singleData.ip) tempObject.ip = singleData.ip;
    if (singleData.last) tempObject.last = singleData.last;
    if (singleData.city) tempObject.city = singleData.city;
    if (singleData.first) tempObject.first = singleData.first;
    if (singleData.email) tempObject.email = singleData.email;
    if (singleData.adres) tempObject.adres = singleData.adres;
    if (singleData.insta) tempObject.insta = singleData.insta;
    if (singleData.postal) tempObject.postal = singleData.postal;
    if (singleData.twitter) tempObject.twitter = singleData.twitter;
    if (singleData.discord) tempObject.discord = singleData.discord;
    if (singleData.birthday) tempObject.birthday = singleData.birthday;

    personArray.push(tempObject);
  });
  report.log(`Loaded ${personArray.length} people`);
});

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

  //Detect command
  if (message.content.startsWith(settings.prefix)) {
    if (blacklist.checkId(message.author.id)) message.channel.send(language.respond('deny', emotion));

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
