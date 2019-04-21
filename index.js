global.latestMessage = new Date();
global.emotion = "happy";

//Hue packages
global.Ssh = require('simple-ssh');
global.Hue = require('node-hue-api');
global.Api = require('node-hue-api').HueApi;
global.LightState = require('node-hue-api').lightState;

//Other packages
global.Fs = require('fs');
global.Http = require('http')
global.Discord = require("discord.js");

//Non classes
global.settings = require('./settings.json');
global.functions = require('./functions.js');

//Custom classes
global.Light = require('./classes/light.js')
global.Person = require('./classes/person.js')
global.Report = require('./classes/report.js');
global.Command = require('./classes/command.js')
global.Language = require('./classes/language.js')
global.Blacklist = require('./classes/blacklist.js');

global.report = new Report(Fs);
global.language = new Language(Fs);
global.blacklist = new Blacklist(Fs);

//Credentials
const hueCredentialsLocation = './credentials/hue.json';
const sshCredentialsLocation = './credentials/shh.json';
const discordCredentialsLocation = './credentials/discord.json';
const scontrolCredentialsLocation = './credentials/scontrol.json';

if (Fs.existsSync(hueCredentialsLocation)) var hueCredentials = require('./credentials/hue.json');
if (Fs.existsSync(sshCredentialsLocation)) var sshCredentials = require("./credentials/shh.json");
if (Fs.existsSync(discordCredentialsLocation)) var discordCredentials = require("./credentials/discord.json");
if (Fs.existsSync(scontrolCredentialsLocation)) var scontrolCredentials = require("./credentials/scontrol.json");

global.bot = new Discord.Client();
global.ssh = new Ssh(sshCredentials);
global.api = new Api(hueCredentials['host'], hueCredentials['username']);

global.lampArray = new Array();
global.personArray = new Array();
global.commandArray = new Array();

//Turn light id array into Light array
settings['lamps'].forEach(function(officeLightId) {
  let lampSingle = new Light(officeLightId, api);
  lampArray.push(lampSingle);
});

//Load commands into array
Fs.readdirSync(`./persons`).forEach(file => {
  let tempData = JSON.parse(require(`./persons/${file}`));
  let tempObject = new Person();

  if (tempData.last) tempObject.last = tempData.last;
  if (tempData.email) tempObject.email = tempData.email;
  if (tempData.first) tempObject.first = tempData.first;
  if (tempData.number) tempObject.number = tempData.number;
  if (tempData.discord) tempObject.discord = tempData.discord;

  personArray.push(tempObject);
});
report.log(`Loaded ${personArray.length} people`);

//Load commands into array
Fs.readdirSync(`./commands`).forEach(file => {
  let tempClass = require(`./commands/${file}`);
  let tempObject = new tempClass();
  commandArray.push(tempObject);
});

bot.on("ready", function() {
  report.log(`Bot is ready. ${bot.user.username}`);
  bot.generateInvite(["ADMINISTRATOR"]).then((data) => report.log(data));

  functions.updateEmotions();
  setInterval(functions.updateEmotions, 1000);
});

bot.on("error", function(data) {
  report.error(data);
});

bot.on("message", async(message) => {
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
