const Fs = require('fs');

module.exports = {
  getRandomInteger: function (tempMin, tempMax) {
    tempMin = Math.ceil(tempMin);
    tempMax = Math.floor(tempMax);
    return Math.floor(Math.random() * (tempMax - tempMin + 1)) + tempMin;
  },
  updateEmotions: function () {
    let last = latestMessage.getTime();
    let recent = new Date().getTime();

    emotion = recent - last <= 86400000 ? "happy" : "sad";
    if (emotion === "happy") bot.user.setActivity('with happy feelings');
    else if (emotion === "sad") bot.user.setActivity('with sad feelings');
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
