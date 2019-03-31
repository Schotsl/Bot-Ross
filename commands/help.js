module.exports = class Help extends Command {
  constructor() {
    super();
    this.trigger = "help";
  }

  executeCustom(command, input, message) {
    message.channel.send(settings.help);
  }
}
