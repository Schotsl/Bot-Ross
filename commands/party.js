// Todo:
// - Fix hardcoded URL
// - Remove all castv2-player logs

let ScannerPromise = require("castv2-player").ScannerPromise();
let MediaPlayer = require("castv2-player").MediaPlayer();
var mp3Duration = require('mp3-duration');

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
            lampArray.forEach(function(lampSingle) {
              lampSingle.getState(function(startState) {

                function executeRandomLight() {
                  setTimeout(function() {
                    let currentTime = functions.getTimeInMillis();
                    if (currentTime - startTime < duration * 1000 - 1500) {
                      lampSingle.setState(startState, executeRandomLight);
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

  }
}
