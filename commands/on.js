module.exports = class On extends Command {
  constructor() {
    super();
    this.timeout = 10000;
    this.trigger = "on";
  }

  executeCustom(command, input, message) {
    message.channel.send(language.respond('confirm', emotion));
    message.channel.send(language.respond('on', emotion));

    let newLightOn = LightState.create();
    lampArray.forEach((officeGroup) => officeGroup.setState(newLightOn.on()));
  }
}
