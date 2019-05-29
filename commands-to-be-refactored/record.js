let fs = require('fs');

function generateOutputFile(channel, member) {
  // use IDs instead of username cause some people have stupid emojis in their name
  const fileName = `./recordings/${channel.id}-${member.id}-${Date.now()}.pcm`;
  return fs.createWriteStream(fileName);
}

module.exports = class Play extends Command {
  constructor() {
    //IDK if i need this -Wouter
    super();
    this.timeout = 200;
    this.trigger = "record";
    this.description = "Record voices.";
  }

  executeCustom(command, input, message) {
    let channelId = message.member.voiceChannelID;
    let channelObject = bot.channels.get(channelId);

    channelObject.join().then(conn => {
      conn.playFile('recordings/test.mp3');
      const receiver = conn.createReceiver();
      message.reply("Well we got this far.");

      conn.on('speaking', (user, speaking) => {
        report.log(`Listening to ${user}`);
        if (speaking) {
          //This might use lost of RAM.
          const audioStream = receiver.createPCMStream(user);
          const outputStream = generateOutputFile(channelObject, user);

          audioStream.pipe(outputStream);
          outputStream.on("data", console.log);

          audioStream.on('end', () => {
            report.log(`Stoped listening to ${user}`);
          });
        }
      })
    });
  }
}
