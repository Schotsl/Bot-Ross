let talkedRecently = new Set();
let latestMessage = new Date();
let emotion = "happy";

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
global.Group = require('./classes/group.js');
global.Report = require('./classes/report.js');
global.Command = require('./classes/command.js')
global.Language = require('./classes/language.js')
global.Blacklist = require('./classes/blacklist.js');

//Credentials
const hueCredentials = require('./credentials/hue.json');
const sshCredentials = require("./credentials/shh.json");
const discordCredentials = require("./credentials/discord.json");
const scontrolCredentials = require("./credentials/scontrol.json");

global.report = new Report(Fs);
global.language = new Language(Fs);
global.blacklist = new Blacklist(Fs);

global.bot = new Discord.Client();
global.ssh = new Ssh(sshCredentials);
global.api = new Api(hueCredentials['host'], hueCredentials['username']);

global.lampArray = new Array();
global.commandArray = new Array();

//Turn light id array into Light array
settings['lamps'].forEach(function(officeLightId) {
  let lampSingle = new Light(officeLightId, api);
  lampArray.push(lampSingle);
});

//Load commands into array
Fs.readdirSync(`./commands`).forEach(file => {
  let tempClass = require(`./commands/${file}`);
  let tempObject = new tempClass();
  commandArray.push(tempObject);
});

let scontrolServer = {
  hostname: 'hedium.nl',
  port: '3000',
  token: scontrolCredentials.token
}

function scontrolGetDevices(callback) {
  const options = {
    hostname: scontrolServer.hostname,
    port: scontrolServer.port,
    path: '/api/devices',
    method: 'GET'
  };
  const req = Http.request(options, (res) => {
    report.log(res.statusCode);
    res.setEncoding('utf8');
    res.on('data', (d) => {
      callback(JSON.parse(d));
    });
  });
  req.on('error', (error) => {
    report.error(error);
  });
  req.end();
}

function scontrolPutDevices(id, value, callback) {
  let deviceArrayID = id;

  data = JSON.stringify({
    token: scontrolServer.token,
    hostname: scontrolServer.hostname,
    port: scontrolServer.port,
    path: '/api/devices',
    method: 'PUT',
    value: value
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

  const req = Http.request(options, (res) => {
    report.log(res.statusCode);
    if (res.statusCode != 200) {
      report.log(`Got a error: ${res.statusCode}`);
      text = `Error! Statuscode ${res.statusCode} Error: `;
      res.on('data', (d) => {
        text += d;
        callback(text);
        return
      })
      return
    }
    res.on('data', (d) => {
    callback(`Aight! ${JSON.stringify(JSON.parse(d))}`);
      report.log(d);
    });
  })
  req.on('error', (error) => {
    callback(`Error! ${error}`);
    report.error(error);
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

    commandArray.forEach((commandObject) => {
      if (commandObject.match(command)) commandObject.execute();
    })

    talkedRecently.add(message.author.id);

    setTimeout(function() {
      talkedRecently.delete(message.author.id);
    }, settings.timeout);

    latestMessage = new Date();
    updateEmotion();
  }
})

bot.login(discordCredentials.token);

//Test
