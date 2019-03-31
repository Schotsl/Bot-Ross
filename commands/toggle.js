module.exports = class Toggle extends Command {
  constructor() {
    super();
    this.timeout = 10000;
    this.trigger = "toggle";
  }

  executeCustom(command, input, message) {
    message.channel.send(language.respond('confirm', emotion));

    lampArray.forEach(function(officeLight) {
      officeLight.toggleLight();
    });
  }
}
