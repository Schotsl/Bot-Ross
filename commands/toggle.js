module.exports = class Toggle extends Command {
  constructor() {
    super();
    this.trigger = "toggle";
  }

  execute(input, message) {
    message.channel.send(language.respond('confirm', emotion));
    report.log(`"${message.author.tag}" used the ".toggle" command`);

    lampArray.forEach(function(officeLight) {
      officeLight.toggleLight();
    });
  }
}
