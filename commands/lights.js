"use strict";

let lightState = require(`node-hue-api`).lightState;

module.exports = class Lights extends Command {
  constructor() {
    super();
    this.commands = [{
        trigger: `off`,
        function: `off`,
        description: `Turn off the lights`,
        timeout: 1000,
        executed: {},
        hidden: false
      },
      {
        trigger: `on`,
        function: `on`,
        description: `Turn on the lights`,
        timeout: 1000,
        executed: {},
        hidden: false
      },
      {
        trigger: `party`,
        function: `party`,
        description: `Start a party!`,
        timeout: 1000,
        executed: {},
        hidden: false
      }
    ];
  }

  off(input, message, respond, person) {

    getRepositoryFactory().getSentenceRepository().getClosestIntention(`confirm`, emotionValue, (sentenceCollection) => {
      respond(sentenceCollection.getSentences()[0].getContent());
    });

    getRepositoryFactory().getSentenceRepository().getClosestIntention(`off`, emotionValue, (sentenceCollection) => {
      respond(sentenceCollection.getSentences()[0].getContent());
    });

    let newLightState = lightState.create();
    getRepositoryFactory().getLightRepository().getAll((lightCollection) => {
      let lightArray = lightCollection.getLights();

      lightArray.forEach((lightSingle) => {
        lightSingle.setState(newLightState.off());
      });
    });
  }

  on(input, message, respond, person) {

    getRepositoryFactory().getSentenceRepository().getClosestIntention(`confirm`, emotionValue, (sentenceCollection) => {
      respond(sentenceCollection.getSentences()[0].getContent());
    });

    getRepositoryFactory().getSentenceRepository().getClosestIntention(`on`, emotionValue, (sentenceCollection) => {
      respond(sentenceCollection.getSentences()[0].getContent());
    });

    let newLightState = lightState.create();
    getRepositoryFactory().getLightRepository().getAll((lightCollection) => {
      let lightArray = lightCollection.getLights();

      lightArray.forEach((lightSingle) => {
        lightSingle.setState(newLightState.on());
      });
    });
  }

  party(input, message, respond, person) {

    getRepositoryFactory().getSentenceRepository().getClosestIntention(`confirm`, emotionValue, (sentenceCollection) => {
      respond(sentenceCollection.getSentences()[0].getContent());
    });

    getRepositoryFactory().getSentenceRepository().getClosestIntention(`on`, emotionValue, (sentenceCollection) => {
      respond(sentenceCollection.getSentences()[0].getContent());
    });

    let newLightState = lightState.create();
    getRepositoryFactory().getLightRepository().getAll((lightCollection) => {
      let lightArray = lightCollection.getLights();

      lightArray.forEach((lightSingle) => {
        for (let i = 0; i < 25; i ++) {

          //Change lights once
          setTimeout(function() {

            //Create a random light state
            let red = functions.getRandomInteger(0, 255);
            let blue = functions.getRandomInteger(0, 255);
            let green = functions.getRandomInteger(0, 255);

            let newState = lightState.create();

            newState.rgb(red, green, blue);
            newState.transitionInstant();

            //Set light state
            lightSingle.setState(newState);

            //Repeat the process 25 times at semi-random intervals
          }, i * functions.getRandomInteger(250, 500));
        }
      });
    });
  }
}
