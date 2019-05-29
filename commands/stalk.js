module.exports = class Stalk extends Command {
  constructor() {
    super();
    this.commands = [
      {trigger: "notify", function: "notify", description: "Get notifications about a specfic person", timeout: 1000, executed: {}}
    ];
  }

  notify(input, message) {
    sentenceRepository.getClosestIntention('confirm', emotionValue, (sentenceCollection) => {
      message.channel.send(sentenceCollection.getSentences()[0].getContent());
    });

    personRepository.getByFirst(input[0], (personCollection) => {
      let personObject = personCollection.getPersons()[0];

      bot.on("voiceStateUpdate", function(oldMember, newMember) {
        //If voice channel change
        if (oldMember.voiceChannelID !== newMember.voiceChannelID) {
          let channelObjects = newMember.guild.channels;
          if (newMember.voiceChannelID !== null && oldMember.voiceChannelID !== null) message.channel.send(`${personObject.getFullname()} changed to ${channelObjects.get(newMember.voiceChannelID).name}`);
          else if (oldMember.voiceChannelID === null) message.channel.send(`${personObject.getFullname()} joined ${channelObjects.get(newMember.voiceChannelID).name}`);
          else if (newMember.voiceChannelID === null) message.channel.send(`${personObject.getFullname()} left ${channelObjects.get(oldMember.voiceChannelID).name}`);
        }

        //If voice mute change
        if (oldMember.selfMute !== newMember.selfMute) {
          if (newMember.selfMute) message.channel.send(`${personObject.getFullname()} muted itself`);
          else message.channel.send(`${personObject.getFullname()} unmuted its self`);
        }

        //If voice mute change
        if (oldMember.selfDeaf !== newMember.selfDeaf) {
          if (newMember.selfDeaf) message.channel.send(`${personObject.getFullname()} deafened itself`);
          else message.channel.send(`${personObject.getFullname()} undeafened itself`);
        }
      });

      bot.on("presenceUpdate", function(oldMember, newMember) {
        //If status change
        if (oldMember.selfDeaf !== newMember.selfDeaf) {
          message.channel.send(`${personObject.getFullname()} status changed to ${newMember.presence.status}`);
        }
      });
    })
  }

}
