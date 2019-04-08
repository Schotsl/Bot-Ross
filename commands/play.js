const ytdl = require('ytdl-core');

module.exports = class Play extends Command {
  constructor() {
    super();
    this.trigger = "play";
  }

  async executeCustom(command, input, message) {
    let channelId = message.member.voiceChannelID;
    let channelObject = bot.channels.get(channelId);

    let streamObject = channelObject.join().then((connection) => {
      const streamOptions = { seek: 0, volume: 1 };
      const stream = ytdl(input[0], { filter : 'audioonly' });
      const dispatcher = connection.playStream(stream, streamOptions);
    })
  }
}
