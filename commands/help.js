module.exports = class Help extends Command {
  constructor() {
    super();
    this.timeout = 10000;
    this.trigger = "help";
    this.description = "Displays all available commands"
  }

  executeCustom(command, input, message) {
    message.channel.send(settings.help);
  }
}
