const talkedRecently = new Set();

//Hue packages
const Hue = require('node-hue-api');
const Api = require('node-hue-api').HueApi;
const LightState = require('node-hue-api').lightState;

//Other packages
const Fs = require('fs');
const Discord = require("discord.js");

//Custom classes
const Light = require('./classes/light.js')
const Group = require('./classes/group.js');
const Report = require('./classes/report.js');

const botoptions = require("./credentials/discord.json");
const hueCredentials = require('./credentials/hue.json');

const settings = require('./settings.json');

global.report = new Report(Fs)
const bot = new Discord.Client();
const api = new Api(hueCredentials['host'], hueCredentials['username']);

let officeLightsId = [10, 11, 12, 13];
let officeLights = new Array();

let officeGroupsId = [8];
let officeGroups = new Array();

//Turn light id array into Light array
officeLightsId.forEach(function(officeLightId) {
  officeLights.push(new Light(officeLightId, api));
});

//Turn group id array into Group array
officeGroupsId.forEach(function(officeGroupsId) {
  officeGroups.push(new Group(officeGroupsId, api));
});

function toggle() {
  officeLights.forEach(function(officeLight) {
    officeLight.toggleLight();
  });
}

function party() {
  officeLights.forEach(function(officeLight) {
    officeLight.getState(function(startState) {

      let totalOffset = 0;
      for (let i = 0; i < 10; i ++ ) {
        totalOffset += getRandomInteger(100, 1000);
        setTimeout(() => {
          let newLightState = LightState.create().on();
          newLightState.ct(getRandomInteger(153, 500));
          newLightState.bri(getRandomInteger(0, 255));
          newLightState.transitionInstant()

          //If last callback, return the lights to normal
          if (i == 9) officeLight.setState(startState);
          else officeLight.setState(newLightState);
        }, totalOffset);
      }
    });
  });
}

function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

bot.on("ready", async () => {
  report.log(`Bot is ready. ${bot.user.username}`);
  report.log(`Invite link ${await bot.generateInvite(["ADMINISTRATOR"])}`);
});

bot.on("message", async message => {
  if (message.content.startsWith(settings.prefix)) {

    let messageArray = message.content.split(" ");
    let command = messageArray[0];

    command = command.substring(1);

    if (!settings.opusers.includes(message.author.id)) {
      if (talkedRecently.has(message.author.id)) return message.channel.send("Wait 1 minute before getting typing this again. - " + message.author);
    }

    switch (command.toLowerCase()) {
      case "info":
      message.channel.send(botoptions.info);
      report.log(`"${message.author}" used the ".info" command`);
      break;

      case "party":
      message.channel.send("Get the party started");
      report.log(`"${message.author}" used the ".party" command`);
      party();
      break;

      case "toggle":
      toggle();
      message.channel.send("Toggled the lights.");
      report.log(`"${message.author.tag}" used the ".toggle" command`);
      break;

      case "on":
      let newLightOn = LightState.create();
      officeGroups[0].setGroup(newLightOn.on());
      break;

      case "off":
      let newLightOff = LightState.create();
      officeGroups[0].setGroup(newLightOff.off());
      break;

      case "temp":
      let newColorTemp = LightState.create();
      if (isNaN(messageArray[1])) {
        //If a temprature string if provided
        if (messageArray[1] == "warm") officeGroups[0].setGroup(newColorTemp.ct(400));
        else if (messageArray[1] == "ice") officeGroups[0].setGroup(newColorTemp.ct(153));
        else if (messageArray[1] == "hot") officeGroups[0].setGroup(newColorTemp.ct(500));
        else if (messageArray[1] == "cold") officeGroups[0].setGroup(newColorTemp.ct(253));
        else return message.channel.send(settings.errors.temp);
      } else {
        //If a temprature number is provided
        if (messageArray[1] > 500 || messageArray[1] < 0) return message.channel.send(settings.errors.temp);
        officeGroups[0].setGroup(newColorTemp.ct(messageArray[1]));
      }
      break;

      case "bri":
      let newBrighness = LightState.create();
      if (isNaN(messageArray[1])) {
        if (messageArray[1] == "bright") officeGroups[0].setGroup(newBrighness.bri(255));
        else if (messageArray[1] == "dim") officeGroups[0].setGroup(newBrighness.bri(50));
        else return message.channel.send(settings.errors.bri);
      } else {
        if (messageArray[1] > 255 || messageArray[1] < 0) return message.channel.send(settings.errors.bri);
        officeGroups[0].setGroup(newBrighness.bri(messageArray[1]));
      }
      break;

      default:
      message.channel.send(settings.default);
      break;
    }
    talkedRecently.add(message.author.id);
    setTimeout(() => {
      talkedRecently.delete(message.author.id);
    }, settings.timeout);
  }
})

bot.login(botoptions.token);
