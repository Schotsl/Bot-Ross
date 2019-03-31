module.exports = class Help extends Command {
  constructor() {
    super();
    this.trigger = "help";
  }

  execute(input, message) {
    message.channel.send(settings.help);
    report.log(`"${message.author}" used the ".help" command`);
  }
}
