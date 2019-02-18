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




let sjorsOffice = [10, 11, 12, 13, 13];



for (let i = 0; i < sjorsOffice.length; i ++) {
    sjorsOffice[i] = new Light(sjorsOffice[i], api);
    sjorsOffice[i].toggleLight();
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
  if(message.author.bot) return; //check if bot, if it is stopcode.
  if((message.channel.type) === "dm") return;

  if(!message.content.startsWith(botoptions.prefix)) return;

  let messageArray = message.content.split(" ");
  let command = messageArray[0];

  command = command.substring(1);

  switch (command.toLowerCase()) {
    case "info":
      message.channel.send(botoptions.info);
      break;

    default:
      message.channel.send(botoptions.default);
      break;
  }
})

bot.login(botoptions.token);
