module.exports = class Notify extends Command {
  constructor() {
    super();
    this.trigger = "notify";
  }

  executeCustom(command, input, message) {
    let singlePerson = functions.getPersons(input[0])[0];
    message.channel.send(language.respond('confirm', emotion));

    let oldStatus;
    setInterval(() => {
      singlePerson.getStatus((newStatus) => {
        if (oldStatus != newStatus && typeof oldStatus !== 'undefined') {
          message.channel.send(`${singlePerson.first} ${singlePerson.last} went from ${oldStatus} to ${newStatus}`);
        }

        oldStatus = newStatus;
      });
    });

  }
}
