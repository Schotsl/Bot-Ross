const botoptions = require("./botoptions.json");
const Discord = require("discord.js");
// const youtube = require("youtube-node");
// const ytdl = require('ytdl-core');

const bot = new Discord.Client();

function permissionlookup(permission, message) {
  if (message.member.id == "127076783714598912") return true;
  if (!message.member.permissions.has([permission], true)) {
    message.channel.send(`<@${message.author.id}> You dont have permissions to do that! You need **${permission.toLowerCase()}**.`);
    return false;
  }
}

bot.on("ready", async () => {
  console.log(`Bot is ready. ${bot.user.username}`);

try {
      let link = await bot.generateInvite(["ADMINISTRATOR"]);
      console.log(link);
    } catch(e) {
        console.log(e.stack);
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
