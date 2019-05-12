module.exports = class Party extends Command {
  constructor() {
    super();
    this.timeout = 10000;
    this.trigger = "party";
    this.description = "Start a 10 second party";
  }

  executeCustom(command, input, message) {
    sentenceRepository.getClosestIntention('confirm', emotionValue, (sentenceCollection) => {
      message.channel.send(sentenceCollection.getSentences()[0].getContent());
    });

    sentenceRepository.getClosestIntention('party', emotionValue, (sentenceCollection) => {
      message.channel.send(sentenceCollection.getSentences()[0].getContent());
    });

    lampArray.forEach(function(lampSingle) {
      lampSingle.getState(function(startState) {

        let totalOffset = 0;
        for (let i = 0; i < 10; i ++ ) {
          totalOffset += functions.getRandomInteger(100, 1000);
          setTimeout(function() {
            let newLightState = LightState.create().on();
            newLightState.ct(functions.getRandomInteger(153, 500));
            newLightState.bri(functions.getRandomInteger(0, 255));
            newLightState.transitionInstant()

            //If last callback, return the lights to normal
            if (i == 9) lampSingle.setState(startState);
            else lampSingle.setState(newLightState);
          }, totalOffset);
        }
      });
    });
  }
}
