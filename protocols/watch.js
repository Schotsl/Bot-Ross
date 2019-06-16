"use strict";

let Log = require('./../classes/Entity/Log.js');

module.exports = class Watch extends Protocol {
  constructor() {
    super();
    this.protocols = [{
      name: `watch`,
      interval: {
        enabled: false,
        value: 0
      },
      function: `watch`,
      description: `Logs discord activities`
    }];
  }

  watch() {
    let state = "";
    report.log(`Initiatings callbacks`);

    bot.on(`voiceStateUpdate`, function(oldMember, newMember) {
      //If voice channel change
      if (oldMember.voiceChannelID !== newMember.voiceChannelID) {
        if (newMember.voiceChannelID !== null && oldMember.voiceChannelID !== null) state = "changed";
        else if (oldMember.voiceChannelID === null) state = "joined";
        else if (newMember.voiceChannelID === null) state = "left";
      }

      //If voice mute change
      if (oldMember.selfMute !== newMember.selfMute) {
        if (newMember.selfMute) state = "muted";
        else state = "unmuted";
      }

      //If voice mute change
      if (oldMember.selfDeaf !== newMember.selfDeaf) {
        if (newMember.selfDeaf) state = "deafened";
        else state = "undeafened";
      }

      if (typeof(state) !== `undefined`) {
        personRepository.getByDiscord(newMember.id, (personCollection) => {
          let person = personCollection.getPersons()[0];

          //Not ideal, if user is still being registered to the database they wont be logged
          if (typeof(person) !== `undefined`) {
            let log = new Log();
            log.setPerson(person.getId());
            log.setState(state);
            logRepository.saveLog(log);
          }
        });
      }
    });

    bot.on(`presenceUpdate`, function(oldMember, newMember) {
      //If status change
      if (oldMember.presence.status !== newMember.presence.status) {
        state = newMember.user.presence.status
      }

      if (typeof(state) !== `undefined`) {
        personRepository.getByDiscord(newMember.id, (personCollection) => {
          let person = personCollection.getPersons()[0];

          //Not ideal, if user is still being registered to the database they wont be logged
          if (typeof(person) !== `undefined`) {
            let log = new Log();
            log.setPerson(person.getId());
            log.setState(state);
            logRepository.saveLog(log);
          }
        });
      }
    });
  }
}
