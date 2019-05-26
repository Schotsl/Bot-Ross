// Todo:
// - Fix hardcoded URL
// - Remove all castv2-player logs

let ScannerPromise = require("castv2-player").ScannerPromise();
let MediaPlayer = require("castv2-player").MediaPlayer();
let mp3Duration = require('mp3-duration');
let lightState = require('node-hue-api').lightState;

module.exports = class Party extends Command {
  constructor() {
    super();
    this.timeout = 10000;
    this.trigger = "party";
    this.description = "Start a 10 second party";

    this.url = "https://data.allofmp3.xyz/j/justice/justice-dvno.mp3";

    let that = this;
    ScannerPromise('Bedroom speaker').then((device) => {
      that.mediaPlayer = new MediaPlayer(device);
    });
  }

  executeCustom(command, input, message) {
    let that = this;

    request.get(that.url)
    .pipe(fs.createWriteStream('music.tmp'))
    .on('error', function(error) {
      report.log(error);
    })
    .on('finish', function() {
      mp3Duration('./music.tmp', function (error, duration) {

        that.mediaPlayer.setVolumePromise(65);
        that.mediaPlayer.stopClientPromise().then(() => {
          that.mediaPlayer.playUrlPromise(that.url).then(() => {
            sentenceRepository.getClosestIntention('confirm', emotionValue, (sentenceCollection) => {
              message.channel.send(sentenceCollection.getSentences()[0].getContent());
            });

            sentenceRepository.getClosestIntention('party', emotionValue, (sentenceCollection) => {
              message.channel.send(sentenceCollection.getSentences()[0].getContent());
            });

            let startTime = functions.getTimeInMillis();
            lightRepository.getAll((lightCollection) => {
              let lightArray = lightCollection.getLights();

              lightArray.forEach((lightSingle) => {
                lightSingle.getState(function(startState) {

                  function executeRandomLight() {
                    setTimeout(function() {
                      let currentTime = functions.getTimeInMillis();
                      if (currentTime - startTime < duration * 1000 - 1500) {
                        lightSingle.setState(startState, executeRandomLight);
                      }
                    }, functions.getRandomInteger(1000, 1500));
                  }

                  executeRandomLight();
                });
              });
            });
          });
        });
      });
    });
  }
}
