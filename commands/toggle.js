module.exports = class Toggle extends Command {
  constructor() {
    super();
    this.timeout = 10000;
    this.trigger = "toggle";
    this.description = "Toggle all the lights";
  }

  executeCustom(command, input, message) {
    sentenceRepository.getClosestIntention('toggle', emotionValue, (sentenceCollection) => {
      message.channel.send(sentenceCollection.getSentences()[0].getContent());
    });

    lampArray.forEach(function(officeLight) {
      officeLight.toggleLight();
    });
  }
}
