let talkedRecently = new Set();
let latestMessage = new Date();
let emotion = "happy";

//Hue packages
const Ssh = require('simple-ssh');
const Hue = require('node-hue-api');
const Api = require('node-hue-api').HueApi;
const LightState = require('node-hue-api').lightState;

//Other packages
const Fs = require('fs');
const Discord = require("discord.js");
const Http = require('http')

//Custom classes
const Light = require('./classes/light.js')
const Group = require('./classes/group.js');
const Report = require('./classes/report.js');
const Language = require('./classes/language.js')
const Blacklist = require('./classes/blacklist.js');

//Credentials
const hueCredentials = require('./credentials/hue.json');
const sshCredentials = require("./credentials/shh.json");
const discordCredentials = require("./credentials/discord.json");
const scontrolCredentials = require("./credentials/scontrol.json");

const settings = require('./settings.json');

global.report = new Report(Fs);
global.language = new Language(Fs);
global.blacklist = new Blacklist(Fs);

const bot = new Discord.Client();
const ssh = new Ssh(sshCredentials);
const api = new Api(hueCredentials['host'], hueCredentials['username']);

let officeLightsId = [10, 11, 12, 13, 16, 2, 14];
let officeLights = new Array();

let officeGroupsId = [8, 1];
let officeGroups = new Array();

let scontrolServer = {
  hostname: 'hedium.nl',
  port: '3000',
  token: scontrolCredentials.token
}

//Turn light id array into Light array
officeLightsId.forEach(function(officeLightId) {
  officeLights.push(new Light(officeLightId, api));
});

//Turn group id array into Group array
officeGroupsId.forEach(function(officeGroupsId) {
  officeGroups.push(new Group(officeGroupsId, api));
});

function updateEmotion() {
  let last = latestMessage.getTime();
  let recent = new Date().getTime();

  emotion = recent - last <= 86400000 ? "happy" : "sad";
  if (emotion === "happy") bot.user.setActivity('with happy feelings');
  else if (emotion === "sad") bot.user.setActivity('with sad feelings');
}

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
        setTimeout(function() {
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

//Discord Permissions
function permissionlookup(permission, message) {
  if (settings.opusers.includes(message.author.id)) return true;
  if (!message.member.permissions.has([permission], true)) {
    message.channel.send(`<@${message.author.id}> You dont have permissions to do that! You need **${permission.toLowerCase()}**.`);
    return false;
  }
}

function scontrolGetDevices() {
  const options = {
    hostname: scontrolServer.hostname,
    port: scontrolServer.port,
    path: '/api/devices',
    method: 'GET'
  };
  const req = http.request(options, (res) => {
    res.setEncoding('utf8');
    console.log(`statusCode: ${res.statusCode}`);
    res.on('data', (d) => {
      devicesObject = JSON.parse(d);
      return devicesObject;
    });
  });
  req.on('error', (error) => {
    report.error(error);
  });
  req.end();
}

function scontrolPutDevices(id, value) {
  let deviceArrayID = id;

  const data = JSON.stringify({
    token: token, //super secure token.
    value: value, //0 = off, 1 = on
  })

  const options = {
    hostname: scontrolServer.hostname,
    port: scontrolServer.port,
    path: `/api/devices/${deviceArrayID}`,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  }

  const req = http.request(options, (res) => {
    res.on('data', (d) => {
      //might need to add stuff here
    })
  })
  req.on('error', (error) => {
    report.error(error)
  })
  req.write(data)
  req.end()
}

bot.on("ready", async() => {
  report.log(`Bot is ready. ${bot.user.username}`);
  report.log(await bot.generateInvite(["ADMINISTRATOR"]));

  setInterval(updateEmotion, 1000);
  updateEmotion();
});

bot.on("error", async(error) => {
  report.error(error);
});

bot.on("message", async(message) => {
  if (message.content.startsWith(settings.prefix)) {
    let messageArray = message.content.split(" ");
    let command = messageArray[0];

    command = command.substring(1);

    if (!settings.opusers.includes(message.author.id)) {
      if (talkedRecently.has(message.author.id)) return message.channel.send("Wait 1 minute before getting typing this again. - " + message.author);
    }

    if (blacklist.checkId(message.author.id)) return message.channel.send("I can't hear you. - " + message.author);

    switch (command.toLowerCase()) {
      case "sc":

      switch (messageArray[1].toLowerCase) {
        case "list":
        message.channel.send(JSON.stringify(scontrolGetDevices()));
        break;

        case "off":
        message.channel.send('cant yet off');
        break;

        case "on":
        message.channel.send('cant yet on');
        break;
      }
      message.channel.send(language.respond('confirm', emotion));

      break;

      case "party":
      message.channel.send(language.respond('confirm', emotion));
      report.log(`"${message.author}" used the ".party" command`);
      party();
      break;

      case "minecraft":
      message.channel.send(language.respond('confirm', emotion));
      report.log(`"${message.author}" used the ".minecraft" command`);
      ssh.exec('cd Minecraft && ./run.sh').start();
      break;

      case "help":
      message.channel.send(settings.help);
      report.log(`"${message.author}" used the ".help" command`);
      break;

      case "ignore":
      //Todo: figure out what line 135 is for
      if (permissionlookup("KICK_MEMBERS", message) == false) return;

      if (settings.opusers.includes(message.author.id)) {
        message.channel.send(language.respond('confirm', emotion));
        blacklist.addId(message.mentions.users.first().id);
      } else {
        message.channel.send(language.respond('deny', emotion));
      }
      report.log(`"${message.author}" used the ".ignore" command`);
      break;

      case "unignore":
      //Todo: figure out what line 148 is for
      if (permissionlookup("KICK_MEMBERS", message) == false) return;

      if (settings.opusers.includes(message.author.id)) {
        message.channel.send(language.respond('confirm', emotion));
        blacklist.removeId(message.mentions.users.first().id);
      } else {
        message.channel.send(language.respond('deny', emotion));
      }
      report.log(`"${message.author}" used the ".unignore" command`);
      break;

      case "toggle":
      toggle();
      message.channel.send("Toggled the lights.");
      report.log(`"${message.author.tag}" used the ".toggle" command`);
      break;

      case "on":
      let newLightOn = LightState.create();
      officeGroups.forEach((officeGroup) => officeGroup.setGroup(newLightOn.on()));
      break;

      case "off":
      let newLightOff = LightState.create();
      officeGroups.forEach((officeGroup) => officeGroup.setGroup(newLightOff.off()));
      break;

      case "temp":
      let newColorTemp = LightState.create();
      if (isNaN(messageArray[1])) {
        //If a temprature string if provided
        if (messageArray[1] == "warm") officeGroups.forEach((officeGroup) => officeGroup.setGroup(newColorTemp.ct(400)));
        else if (messageArray[1] == "ice") officeGroups.forEach((officeGroup) => officeGroup.setGroup(newColorTemp.ct(153)));
        else if (messageArray[1] == "hot") officeGroups.forEach((officeGroup) => officeGroup.setGroup(newColorTemp.ct(500)));
        else if (messageArray[1] == "cold") officeGroups.forEach((officeGroup) => officeGroup.setGroup(newColorTemp.ct(253)));
        else return message.channel.send(settings.errors.temp);
      } else {
        //If a temprature number is provided
        if (messageArray[1] > 500 || messageArray[1] < 0) return message.channel.send(settings.errors.temp);
        officeGroups.forEach((officeGroup) => officeGroup.setGroup(newColorTemp.ct(messageArray[1])));
      }
      break;

      case "bri":
      let newBrighness = LightState.create();
      if (isNaN(messageArray[1])) {
        //If a brightness string if provided
        if (messageArray[1] == "bright") officeGroups.forEach((officeGroup) => officeGroup.setGroup(newBrighness.bri(255)));
        else if (messageArray[1] == "dim") officeGroups.forEach((officeGroup) => officeGroup.setGroup(newBrighness.bri(50)));
        else return message.channel.send(settings.errors.bri);
      } else {
        //If a brightness number is provided
        if (messageArray[1] > 255 || messageArray[1] < 0) return message.channel.send(settings.errors.bri);
        officeGroups.forEach((officeGroup) => officeGroup.setGroup(newBrighness.bri(messageArray[1])));
      }
      break;

      default:
      message.channel.send(settings.default);
      break;
    }
    talkedRecently.add(message.author.id);

    setTimeout(function() {
      talkedRecently.delete(message.author.id);
    }, settings.timeout);

    latestMessage = new Date();
    updateEmotion();
  }
})

bot.login(discordCredentials.token);
