"use strict";

let lightState = require(`node-hue-api`).lightState;

module.exports = class Lights extends Command {
  constructor() {
    super();
    this.commands = [
      {trigger: `off`, function: `off`, description: `Turn off the lights`, timeout: 1000, executed: {}, hidden: false},
      {trigger: `on`, function: `on`, description: `Turn on the lights`, timeout: 1000, executed: {}, hidden: false}
    ];
  }

  off(input, message) {
    sentenceRepository.getClosestIntention(`confirm`, emotionValue, (sentenceCollection) => {
      message.channel.send(sentenceCollection.getSentences()[0].getContent());
    });

    sentenceRepository.getClosestIntention(`off`, emotionValue, (sentenceCollection) => {
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

  on(input, message) {
    sentenceRepository.getClosestIntention(`confirm`, emotionValue, (sentenceCollection) => {
      message.channel.send(sentenceCollection.getSentences()[0].getContent());
    });

    sentenceRepository.getClosestIntention(`on`, emotionValue, (sentenceCollection) => {
      message.channel.send(sentenceCollection.getSentences()[0].getContent());
    });

    let newLightState = lightState.create();
    lightRepository.getAll((lightCollection) => {
      let lightArray = lightCollection.getLights();

      lightArray.forEach((lightSingle) => {
        lightSingle.setState(newLightState.on());
      });
    });
  }
}
