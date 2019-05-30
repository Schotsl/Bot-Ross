"use strict";

module.exports = class Debug extends Command {
  constructor() {
    super();
    this.commands = [
      {trigger: `shutdown`, function: `shutdown`, description: `Kills the node process`, timeout: 1000, executed: {}, hidden: true}
    ];
  }

  shutdown(input, message) {
    sentenceRepository.getClosestIntention(`shutdown`, emotionValue, (sentenceCollection) => {
      message.channel.send(sentenceCollection.getSentences()[0].getContent()).then(() => {

        //Kill node process
        process.exit()
      });
    });
  }
}
