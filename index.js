const talkedRecently = new Set();

const Discord = require("discord.js");

const Fs = require('fs');
const Hue = require('node-hue-api').HueApi;

const Light = require('./classes/light.js')
const Report = require('./classes/report.js');

const botoptions = require("./credentials/bot.json");
const hueCredentials = require('./credentials/hue.json');

global.report = new Report(Fs)
const bot = new Discord.Client();
const api = new Hue(hueCredentials['host'], hueCredentials['username']);

let officeLightsId = [10, 11, 12, 13];
let officeLights = new Array();

officeLightsId.forEach(function(officeLightId) {
  officeLights.push(new Light(officeLightId, api));
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

function notice() {
  let oldStatus = new Array();
  officeLights.forEach(function(officeLight) {
    oldStatus.push(officeLigh.getState());
  })

  //Actually do stuff

  officeLights.forEach(function(officeLight, index) {
    officeLight.setState(oldStatus[index]);
  })}

  function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }


  function permissionlookup(permission, message) {
    if (message.member.id == "127076783714598912") return true;
    if (!message.member.permissions.has([permission], true)) {
      message.channel.send(`<@${message.author.id}> You dont have permissions to do that! You need **${permission.toLowerCase()}**.`);
      return false;
    }
  }

  bot.on("ready", async () => {
    report.log(`Bot is ready. ${bot.user.username}`);

    try {
      let link = await bot.generateInvite(["ADMINISTRATOR"]);
      report.log(link);
    } catch(e) {
      report.log(e.stack);
    }
  });

  bot.on("message", async message => {
    if(message.author.bot) return;
    if((message.channel.type) === "dm") return;

    if(!message.content.startsWith(botoptions.prefix)) return;

    let messageArray = message.content.split(" ");
    let command = messageArray[0];

    command = command.substring(1);

    switch (command.toLowerCase()) {
      case "info":
      message.channel.send(botoptions.info);
      break;

    case "toggle":
    if (talkedRecently.has(message.author.id)) {
      message.channel.send("Wait 1 minute before getting typing this again. - " + message.author);
    } else {

      case "toggle":
      if (talkedRecently.has(msg.author.id)) {
        msg.channel.send("Wait 1 minute before getting typing this again. - " + msg.author);
      } else {

        toggle();
        message.channel.send("Toggled the lights.");

      talkedRecently.add(message.author.id);
      setTimeout(() => {
        // Removes the user from the set after a minute
        talkedRecently.delete(message.author.id);
      }, 60000);
    }

        talkedRecently.add(msg.author.id);
        setTimeout(() => {
          // Removes the user from the set after a minute
          talkedRecently.delete(msg.author.id);
        }, 60000);
      }

      break;

      default:
      message.channel.send(botoptions.default);
      break;
    }
  })

  bot.login(botoptions.token);
