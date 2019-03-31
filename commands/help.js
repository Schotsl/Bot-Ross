module.exports = class Help extends Command {
  constructor() {
    super();
    this.trigger = "help";
  }

  executeCustom(input, message) {
    message.channel.send(settings.help);
    report.log(`${message.author.tag} (${message.author.id}) used the ".help" command`);
  }
}
