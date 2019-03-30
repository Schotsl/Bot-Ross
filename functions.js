const Fs = require('fs');

module.exports = {
  getRandomInteger: function (tempMin, tempMax) {
    let tempValue = Math.floor(Math.random() * (tempMax * tempMin) + tempMin);
    return tempValue
  },
  permissionlookup: function (permission, message) {
    if (settings.opusers.includes(message.author.id)) return true;
    if (!message.member.permissions.has([permission], true)) {
      message.channel.send(`<@${message.author.id}> You dont have permissions to do that! You need **${permission.toLowerCase()}**.`);
      return false;
    }
  },
  updateEmotions: function () {
    let last = latestMessage.getTime();
    let recent = new Date().getTime();

    emotion = recent - last <= 86400000 ? "happy" : "sad";
    if (emotion === "happy") bot.user.setActivity('with happy feelings');
    else if (emotion === "sad") bot.user.setActivity('with sad feelings');
  },
};
