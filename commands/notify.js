module.exports = class Notify extends Command {
  constructor() {
    super();
    this.timeout = 10000;
    this.trigger = "notify";
    this.description = "Get notified when persons status changes"
  }

  executeCustom(command, input, message) {
    sentenceRepository.getClosestIntention('confirm', emotionValue, (sentenceCollection) => {
      message.channel.send(sentenceCollection.getSentences()[0].getContent());
    });

    let oldStatus;
    let oldChannel;

    setInterval(() => {
      personRepository.getByFirst(input[0], (personCollection) => {
        let personArray = personCollection.getPersons();

        personArray.forEach((personObject) => {
            personObject.getDiscordStatus((newStatus) => {
              if (oldStatus != newStatus && typeof oldStatus !== 'undefined') {
                let string = `${personObject.getFullname()} went from ${oldStatus} to ${newStatus}`;
                message.channel.send(string);
              }

              oldStatus = newStatus;
            });

            personObject.getDiscordChannel((newChannel) => {
              if (oldChannel != newChannel && typeof oldStatus !== 'undefined') {
                let string = typeof newChannel !== 'undefined' ? `${personObject.getFullname()} joined voice` : `${personObject.getFullname()} left voice`;
                message.channel.send(string);
              }

              oldChannel = newChannel;
            });
          });
      });
    }, 1000);
  }
}
