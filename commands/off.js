let lightState = require('node-hue-api').lightState;

module.exports = class Off extends Command {
  constructor() {
    super();
    this.timeout = 10000;
    this.trigger = "off";
    this.description = "Turn off all the lights";
  }

  executeCustom(command, input, message) {
    sentenceRepository.getClosestIntention('confirm', emotionValue, (sentenceCollection) => {
      message.channel.send(sentenceCollection.getSentences()[0].getContent());
    });

    sentenceRepository.getClosestIntention('off', emotionValue, (sentenceCollection) => {
      message.channel.send(sentenceCollection.getSentences()[0].getContent());
    });

    let newLightState = lightState.create();
    lightRepository.getAll((lightCollection) => {
      let lightArray = lightCollection.getLights();

      lightArray.forEach((lightSingle) => {
        lightSingle.setState(newLightState.off());
      });
    });
  }
}
