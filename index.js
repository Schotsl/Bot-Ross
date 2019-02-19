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

const botoptions = require("./credentials/authkeys.json");
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
    for (let i = 0; i < 9; i ++ ) {
      setTimeout(() => {
        officeLight.toggleLight();
      }, getRandomInteger(100, 1000));
    }
  });
}

function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function groupTemp(value, group) {
  let data = LightState.create().ct(value);

  group.setGroup(data);
}

bot.on("ready", async () => {
  report.log(`Bot is ready. ${bot.user.username}`);
  report.log(`Invite link ${await bot.generateInvite(["ADMINISTRATOR"])}`);
});

bot.on("message", async message => {
<<<<<<< HEAD
  if (message.content.startsWith(settings.prefix)) {
=======
  if (message.content.startsWith(botoptions.prefix)) {
>>>>>>> a1dcdbc9c845320f8f63adbea82ae4c76b0d96cf

    let messageArray = message.content.split(" ");
    let command = messageArray[0];

    command = command.substring(1);

<<<<<<< HEAD
    if (talkedRecently.has(message.author.id)) return message.channel.send("Wait 1 minute before getting typing this again. - " + message.author);
console.log(talkedRecently);

=======
>>>>>>> a1dcdbc9c845320f8f63adbea82ae4c76b0d96cf
    switch (command.toLowerCase()) {
      case "info":
      message.channel.send(botoptions.info);
      break;

      case "party":
      message.channel.send("Get the party started");
      party();
      break;

      case "toggle":
      if (talkedRecently.has(message.author.id)) {
        message.channel.send("Wait 1 minute before getting typing this again. - " + message.author);
      } else {

        toggle();
        message.channel.send("Toggled the lights.");

        talkedRecently.add(message.author.id);
        setTimeout(() => {
          // Removes the user from the set after a minute
          talkedRecently.delete(message.author.id);
        }, 60000);
      }
      break;

      case "set":
      if (isNaN(messageArray[1] && isNaN(messageArray[2]))) return message.channel.send("Please provide a number and off/on");
      if (!(messageArray[2] == "off" || messageArray[2] == "on")) return message.channel.send("Please provide a number and off/on");
      let state = messageArray[2] == "off" ? false : true;

<<<<<<< HEAD
      let stateObject = {
        on: state,
      }
=======
      let stateObject = lightState.create();
      stateObject.on();

>>>>>>> a1dcdbc9c845320f8f63adbea82ae4c76b0d96cf
      officeLights[messageArray[1] -1].setState(stateObject);
      break;

      case "temp":
      if (isNaN(messageArray[1])) {
<<<<<<< HEAD
        if (messageArray[1] == "warm") return groupTemp(400, officeGroups[0]);
        if (messageArray[1] == "cold") return groupTemp(253, officeGroups[0]);
        if (messageArray[1] == "ice") return groupTemp(153, officeGroups[0]);
        if (messageArray[1] == "hot") return groupTemp(500, officeGroups[0]);
=======
        let newColorTemp = LightState.create();

        if (messageArray[1] == "warm") officeGroups[0].setGroup(newColorTemp.ct(400));
        else if (messageArray[1] == "ice") officeGroups[0].setGroup(newColorTemp.ct(153));
        else if (messageArray[1] == "hot") officeGroups[0].setGroup(newColorTemp.ct(500));
        else if (messageArray[1] == "cold") officeGroups[0].setGroup(newColorTemp.ct(253));
>>>>>>> a1dcdbc9c845320f8f63adbea82ae4c76b0d96cf
      }
      message.channel.send("Changing color temp...");
      break;

      default:
<<<<<<< HEAD
      message.channel.send(settings.default);
      break;
    }
    talkedRecently.add(message.author.id);
    setTimeout(() => {
      talkedRecently.delete(message.author.id);
    }, 60000);
=======
      message.channel.send(botoptions.default);
      break;
    }
>>>>>>> a1dcdbc9c845320f8f63adbea82ae4c76b0d96cf
  }
})

bot.login(botoptions.token);
