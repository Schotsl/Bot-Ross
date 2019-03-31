const Fs = require('fs');

module.exports = {
  getRandomInteger: function (tempMin, tempMax) {
    let tempValue = Math.floor(Math.random() * (tempMax * tempMin) + tempMin);
    return tempValue
  },
  updateEmotions: function () {
    let last = latestMessage.getTime();
    let recent = new Date().getTime();

    emotion = recent - last <= 86400000 ? "happy" : "sad";
    if (emotion === "happy") bot.user.setActivity('with happy feelings');
    else if (emotion === "sad") bot.user.setActivity('with sad feelings');
  },
};
