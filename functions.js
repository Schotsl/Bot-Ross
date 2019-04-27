const Fs = require('fs');

module.exports = {
  getRandomInteger: function (tempMin, tempMax) {
    tempMin = Math.ceil(tempMin);
    tempMax = Math.floor(tempMax);
    return Math.floor(Math.random() * (tempMax - tempMin + 1)) + tempMin;
  },
  updateEmotions: function () {
    emotionValue = emotionValue * 0.9999;

    if (emotionValue > 0.5) {
      // Make sure setActivity and setAvatar is only used once
      if (emotionState !== 1) {
        bot.user.setActivity('with happy feelings');
        bot.user.setAvatar('./assets/happy.png');
        emotionState = 1;
      }
    } else if (emotionValue < -0.5) {
      // Make sure setActivity and setAvatar is only used once
      if (emotionState !== -1) {
        bot.user.setActivity('with sad feelings');
        bot.user.setAvatar('./assets/sad.png');
        emotionState = -1;
      }
    } else {
      // Make sure setActivity and setAvatar is only used once
      if (emotionState !== 0) {
        bot.user.setActivity('with neutral feelings');
        bot.user.setAvatar('./assets/neutral.png');
        emotionState = 0;
      }
    }
  },
  getPersons: function (tempString) {
    tempString = tempString.toLowerCase();
    tempArray = new Array();

    personArray.forEach((tempPerson) => {
      if (tempPerson.discord.toLowerCase() == tempString) tempArray.push(tempPerson);
      else if (tempPerson.email.toLowerCase() == tempString) tempArray.push(tempPerson);
      else if (tempPerson.first.toLowerCase() == tempString) tempArray.push(tempPerson);
    })

    return tempArray;
  }
};
