module.exports = class On extends Command {
  constructor() {
    super();
    this.timeout = 10000;
    this.trigger = "on";
    this.description = "Turn on all the lights";
  }

  executeCustom(command, input, message) {
    sentenceRepository.getClosestIntention('confirm', emotionValue, (sentenceCollection) => {
      message.channel.send(sentenceCollection.getSentences()[0].getContent());
    });

    sentenceRepository.getClosestIntention('on', emotionValue, (sentenceCollection) => {
      message.channel.send(sentenceCollection.getSentences()[0].getContent());
    });

    let newLightOn = LightState.create();
    lampArray.forEach((officeGroup) => officeGroup.setState(newLightOn.on()));
  }
}
