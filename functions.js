"use strict";

module.exports = {
  getTimeInMillis: function() {
    return new Date().getTime();
  },
  getRandomInteger: function(tempMin, tempMax) {
    tempMin = Math.ceil(tempMin);
    tempMax = Math.floor(tempMax);
    return Math.floor(Math.random() * (tempMax - tempMin + 1)) + tempMin;
  },
  getFileExtension: function(fileName) {
    let periodIndex = fileName.lastIndexOf('.');
    return (periodIndex < 0) ? '' : fileName.substr(periodIndex);
  },
  setEmotions: function() {
    emotionValue = emotionValue * 0.9999;

    if (emotionValue > 0.5) {
      // Make sure setActivity and setAvatar is only used once
      if (emotionState !== 1) {
        bot.user.setActivity(`with happy feelings`);
        bot.user.setAvatar(`./assets/happy.png`);
        emotionState = 1;
      }
    } else if (emotionValue < -0.5) {
      // Make sure setActivity and setAvatar is only used once
      if (emotionState !== -1) {
        bot.user.setActivity(`with sad feelings`);
        bot.user.setAvatar(`./assets/sad.png`);
        emotionState = -1;
      }
    } else {
      // Make sure setActivity and setAvatar is only used once
      if (emotionState !== 0) {
        bot.user.setActivity(`with neutral feelings`);
        bot.user.setAvatar(`./assets/neutral.png`);
        emotionState = 0;
      }
    }
  }
};
