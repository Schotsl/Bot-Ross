// Todo:
// - Fix hardcoded URL
// - Remove all castv2-player logs
// - Extend light cycle to music

let ScannerPromise = require("castv2-player").ScannerPromise();
let MediaPlayer = require("castv2-player").MediaPlayer();

module.exports = class Party extends Command {
  constructor() {
    super();
    this.timeout = 10000;
    this.trigger = "party";
    this.description = "Start a 10 second party";

    let that = this;

    ScannerPromise('Bedroom speaker').then((device) => {
      that.mediaPlayer = new MediaPlayer(device);
    });
  }

  executeCustom(command, input, message) {
    let that = this;

    that.mediaPlayer.stopClientPromise().then(() => {
      that.mediaPlayer.playUrlPromise("http://wouterdebruijn.nl/music.mp3").then(() => {
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
      });
    });

  }
}
