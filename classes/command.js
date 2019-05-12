module.exports = class Command {
  constructor() {
    this.timeout = 0;
    this.trigger = "";
    this.executed = {};
  }

  match(input) {
    return input === this.trigger;
  }

  executeDefault(command, input, message) {
    report.log(`${message.author.tag} (${message.author.id}) used the "${command}" command`);

    if (this.checkTimeout(message.author.id)) {
      this.saveTimeout(message.author.id);
      this.executeCustom(command, input, message);
    } else {
      sentenceRepository.getClosestIntention('deny', emotionValue, (sentenceCollection) => {
        message.channel.send(sentenceCollection.getSentences()[0].getContent());
      });
      report.log(`${message.author.tag} (${message.author.id}) was timed out`);
    }
  }

  checkTimeout(id) {
    //Check if ID is timedout
    if (this.executed[id]) {
      let timeMillis = new Date().getTime();
      let timeDiffrence = timeMillis - this.executed[id];
      if (timeDiffrence <= this.timeout) return false;
    }

    //Clean array
    for (var execute in this.executed) {
      let timeMillis = new Date().getTime();
      let timeDiffrence = timeMillis - this.executed[id];
      if (timeDiffrence > this.timeout) delete this.executed[execute]
    };

    return true;
  }

  saveTimeout(id) {
    let timeMillis = new Date().getTime();
    this.executed[id] = timeMillis;
  }
}
