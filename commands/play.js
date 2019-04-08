const ytdl = require('ytdl-core');

module.exports = class Play extends Command {
  constructor() {
    super();
    this.trigger = "play";
  }

  async executeCustom(command, input, message) {
    let channelId = message.member.voiceChannelID;
    let channelObject = bot.channels.get(channelId);

    global.voiceChannelObject = await channelObject.join();

    const stream = ytdl(input[0], { filter : 'audioonly' });
    const dispatcher = voiceChannelObject.playStream(stream);
    dispatcher.on("end", end => voiceChannelObject.disconnect());
  }
}
