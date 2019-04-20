const ytdl = require('ytdl-core');

module.exports = class Play extends Command {
  constructor() {
    super();
    this.trigger = "play";

    this.playing = false;
    this.queue = new Array();
  }

  async executeCustom(command, input, message) {
    let channelId = message.member.voiceChannelID;
    let channelObject = bot.channels.get(channelId);

    let stream = ytdl(input[0], { filter : 'audioonly' });
    this.queue.push(stream);

    if (!this.playing) {
      global.voiceChannelObject = await channelObject.join();
      this.playing = true;
      this.playQueue();
    }
  }

  playQueue() {
    if (this.queue.length > 0) {
      let streamObject = this.queue[0];
      const dispatcher = voiceChannelObject.playStream(streamObject);

      let that = this;
      dispatcher.on("end", end => {
        that.queue.shift();
        that.playQueue();
      });
    } else {
      voiceChannelObject.disconnect()
      this.playing = false;
    }
  }
}
