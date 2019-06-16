"use strict";

module.exports = class Command {
  constructor() {
    this.commands = [];
  }

  execute(command, params, message) {
    this.commands.forEach((commandArray) => {
      if (commandArray.trigger === command) {

        //Check if user hasn't timedout
        if (this.checkTimeout(message.author.id, commandArray.executed, commandArray.timeout)) {
          commandArray.executed[message.author.id] = new Date().getTime();
          this[commandArray.function](params, message);
        } else {
          getRepositoryFactory().getSentenceRepository().getClosestIntention(`deny`, emotionValue, (sentenceCollection) => {
            message.channel.send(sentenceCollection.getSentences()[0].getContent());
          });
          report.log(`${message.author.tag} (${message.author.id}) was timed out`);
        }
      }
    });
  }

  checkTimeout(id, object, timeout) {
    //Check if ID is timedout
    if (object[id]) {
      let timeMillis = new Date().getTime();
      let timeDiffrence = timeMillis - object[id];
      if (timeDiffrence <= timeout) return false;
    }

    //Clean array
    for (let execute in this.executed) {
      let timeMillis = new Date().getTime();
      let timeDiffrence = timeMillis - this.executed[id];
      if (timeDiffrence > this.timeout) delete this.executed[execute]
    };

    return true;
  }
}
