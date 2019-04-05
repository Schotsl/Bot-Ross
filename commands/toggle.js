module.exports = class Toggle extends Command {
  constructor() {
    super();
    this.timeout = 10000;
    this.trigger = "toggle";
  }

  executeCustom(command, input, message) {
    // message.channel.send(language.respond('confirm', emotion));
    console.log(language.respond('toggle', emotion));
    message.channel.send(language.respond('toggle', emotion));

    lampArray.forEach(function(officeLight) {
      officeLight.toggleLight();
    });
  }
}
