module.exports = class Toggle extends Command {
  constructor() {
    super();
    this.timeout = 10000;
    this.trigger = "toggle";
  }

  executeCustom(input, message) {
    message.channel.send(language.respond('confirm', emotion));
    report.log(`${message.author.tag} (${message.author.id}) used the ".toggle" command`);

    lampArray.forEach(function(officeLight) {
      officeLight.toggleLight();
    });
  }
}
