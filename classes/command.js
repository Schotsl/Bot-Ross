"use strict";

module.exports = class Command {
  constructor() {
    this.commands = [];
  }

  execute(command, params, message, respond, person) {

    this.commands.forEach((commandArray) => {
      if (commandArray.trigger === command) {

        //Check if user hasn't timedout
        if (this.checkTimeout(person.getId(), commandArray.executed, commandArray.timeout)) {
          commandArray.executed[person.getId()] = new Date().getTime();
          this[commandArray.function](params, message, respond, person);
        } else {
          getRepositoryFactory().getSentenceRepository().getClosestIntention(`deny`, emotionValue, (sentenceCollection) => {
            respond(sentenceCollection.getSentenceArray()[0].getContent());
          });
          report.log(`${person.getFullName()} was timed out`);
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
